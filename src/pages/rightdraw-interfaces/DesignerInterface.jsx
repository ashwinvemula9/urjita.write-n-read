import React, { useState, useEffect, useCallback } from "react";
import { ArrowDown, ArrowUp, Target, FileText } from "lucide-react";
import {
  Input,
  Select,
  Button,
  Card,
  FormSection,
} from "../../components/common/ReusableComponents";
import { pcbAPI, componentsAPI, rulesAPI } from "../../services/api/endpoints";
import { toast } from "react-toastify";
import RulesComponent from "../RulesComponent";
import generatePDF from "../PDFDocument";

import { cadAPI } from "../../services/api/endpoints";

// Constants
const STEPS = {
  BASIC_INFO: "basicInfo",
  PCB_SPECS: "pcbSpecs",
  DESIGN_RULES: "designRules",
};

const STEP_ORDER = [STEPS.BASIC_INFO, STEPS.PCB_SPECS, STEPS.DESIGN_RULES];

const REQUIRED_FIELDS = {
  [STEPS.BASIC_INFO]: ["oppNumber", "opuNumber", "modelName", "partNumber", "component","revisionNumber"],
  [STEPS.PCB_SPECS]: [],
  [STEPS.DESIGN_RULES]: ["selectedSubCategory"],
};

// Initial States
const initialFormState = {
  [STEPS.BASIC_INFO]: {
    oppNumber: "",
    opuNumber: "",
    eduNumber: "",
    modelName: "",
    partNumber: "",
    component: "",
    revisionNumber:""
  },
  [STEPS.PCB_SPECS]: {
    selectedSpecs: {},
  },
  [STEPS.DESIGN_RULES]: {
    selectedCheckboxes: {},
    selectedSubCategory: "",
    acknowledge: false,
  },
};

const initialApiDataState = {
  specifications: [],
  components: [],
  designOptions:[],
  designRules: [],
};

const DesignerInterface = () => {
  // Form State
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormState);
  const [isDirty, setIsDirty] = useState(false);

  // API Data State
  const [apiData, setApiData] = useState(initialApiDataState);

  // Loading States
  const [loadingStates, setLoadingStates] = useState({
    initialData: false,
    rules: false,
    submission: false,
  });

  // Error States
  const [errors, setErrors] = useState({
    initialData: null,
    rules: null,
    submission: null,
  });

  // Load saved form data
  useEffect(() => {
    const savedData = localStorage.getItem("designerFormData");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (err) {
        console.error("Error loading saved form data:", err);
      }
    }
  }, []);
  console.log("formData", formData)
  console.log("ApiData", apiData)


  // Fetch Initial Data
  const fetchInitialData = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, initialData: true }));
    setErrors(prev => ({ ...prev, initialData: null }));

    try {
      const [specs, components] = await Promise.all([
        pcbAPI.getSpecification(1),
        componentsAPI.getAll(),
      ]);

      if (!specs || !components) {
        throw new Error("Failed to load initial data");
      }

      setApiData(prev => ({
        ...prev,
        specifications: specs,
        components,
      }));
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        initialData: err.message || "Failed to load initial data"
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, initialData: false }));
    }
  }, []);

  const fetchDesignOptions = async () => {
    try {
    const response = await rulesAPI.getDesignOptions()
    setApiData(prev => ({ ...prev, designOptions: response }));
     }
    catch(err) {
      toast.error("Something went wrong, please try again later")
      console.log(err)
}
  }

  // Fetch Design Rules
  const fetchDesignRules = useCallback(async () => {
    const selectedOptions = Object.entries(formData[STEPS.DESIGN_RULES].selectedCheckboxes)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    if (!selectedOptions.length) return;

    setLoadingStates(prev => ({ ...prev, rules: true }));
    setErrors(prev => ({ ...prev, rules: null }));

    try {
      const rules = await rulesAPI.getRules(selectedOptions);
      setApiData(prev => ({ ...prev, designRules: rules }));
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        rules: "Failed to load design rules"
      }));
      toast.error("Failed to load design rules. Please try again.");
    } finally {
      setLoadingStates(prev => ({ ...prev, rules: false }));
    }
  }, [formData[STEPS.DESIGN_RULES].selectedCheckboxes]);

  // Effect Hooks
  useEffect(() => {
    fetchInitialData();
    fetchDesignOptions()
  }, []);

  useEffect(() => {
    if (currentStep === 2) {
      fetchDesignRules();
    }
  }, [formData[STEPS.DESIGN_RULES].selectedCheckboxes, currentStep]);

  useEffect(() => {
    if (isDirty) {
      localStorage.setItem("designerFormData", JSON.stringify(formData));
    }
  }, [formData, isDirty]);

  // Form Validation
  const validators = {
    [STEPS.BASIC_INFO]: (data) => {
      return REQUIRED_FIELDS[STEPS.BASIC_INFO].every(
        (field) => data[field]?.trim().length > 0
      );
    },
    [STEPS.PCB_SPECS]: (data) => {
      if (!apiData.specifications.length) return false;
      return Object.keys(data.selectedSpecs).length === apiData.specifications.length;
    },
    [STEPS.DESIGN_RULES]: (data) => {
      const hasSelectedOptions = Object.values(data.selectedCheckboxes).some(Boolean);
      return hasSelectedOptions && data.acknowledge;
    },
  };

  // Event Handlers
  const handleFieldChange = useCallback((step, field, value) => {
    setIsDirty(true);
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value,
      },
    }));
  }, []);

  const currentStepKey = STEP_ORDER[currentStep];
  const isCurrentStepValid =
    validators[currentStepKey]?.(formData[currentStepKey]) ?? false;
  
  
    const createTemplate = async (formData) => {
      // Transform form data to match API request format
      const transformedData = {
        oppNumber: formData.basicInfo.oppNumber,
        opuNumber: formData.basicInfo.opuNumber,
        eduNumber: formData.basicInfo.eduNumber,
        modelName: formData.basicInfo.modelName,
        partNumber: formData.basicInfo.partNumber,
        component: formData.basicInfo.component,
        revisionNumber: formData.basicInfo.revisionNumber,
        componentSpecifications: formData.pcbSpecs.selectedSpecs,
        designOptions: Object.entries(formData.designRules.selectedCheckboxes)
          .filter(([_, isSelected]) => isSelected)
          .map(([id]) => id)
      };
    
      try {
        const response = await cadAPI.createTemplate(transformedData);
        toast.success('Template created successfully!');
        return response;
      } catch (error) {
        console.error('Error creating template:', error);
        throw new Error(error.message || 'Failed to create template');
      }
    };

  const handleSubmit = async () => {
    setLoadingStates(prev => ({ ...prev, submission: true }));
    setErrors(prev => ({ ...prev, submission: null }));

    try {
      const isValid = STEP_ORDER.every((step) => validators[step](formData[step]));
      if (!isValid) {
        throw new Error("Please complete all required fields");
      }

      // Add your submit logic here
      await createTemplate(formData);

      // Reset form on success
      setFormData(initialFormState);
      setCurrentStep(0);
      setIsDirty(false);
      localStorage.removeItem("designerFormData");
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submission: err.message || "Failed to submit form"
      }));
      toast.error(err.message || "Failed to submit form");
    } finally {
      setLoadingStates(prev => ({ ...prev, submission: false }));
    }
  };

  const StepContent = {
    [STEPS.BASIC_INFO]: () => (
      <FormSection title="Basic Information">
        <Input
          label="OPP Number"
          value={formData[STEPS.BASIC_INFO].oppNumber}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, "oppNumber", value)}
          required
        />
        <Input
          label="OPU Number"
          value={formData[STEPS.BASIC_INFO].opuNumber}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, "opuNumber", value)}
          required
        />
        <Input
          label="EDU Number"
          value={formData[STEPS.BASIC_INFO].eduNumber}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, "eduNumber", value)}
        />
        <Input
          label="Model Name"
          value={formData[STEPS.BASIC_INFO].modelName}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, "modelName", value)}
          required
        />
        <Input
          label="Part Number"
          value={formData[STEPS.BASIC_INFO].partNumber}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, "partNumber", value)}
          required
        />
        <Input
        label="Revision Number"
        value={formData[STEPS.BASIC_INFO].revisionNumber}
        onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, "revisionNumber", value)}
        required
      />
        <Select
          label="Component"
          options={[{ value: "b14", label: "B14" }]}
          value={formData[STEPS.BASIC_INFO].component}
          onChange={(value) => handleFieldChange(STEPS.BASIC_INFO, "component", value)}
          required
        />
      </FormSection>
    ),

    [STEPS.PCB_SPECS]: () => (
      <FormSection title="PCB Specifications">
        {apiData.specifications.map((spec) => (
          <Select
            key={spec.category_id}
            label={spec.category_name}
            options={spec.subcategories.map((sub) => ({
              value: sub.id,
              label: sub.name,
            }))}
            value={formData[STEPS.PCB_SPECS].selectedSpecs[spec.category_id] || ""}
            onChange={(value) =>
              handleFieldChange(STEPS.PCB_SPECS, "selectedSpecs", {
                ...formData[STEPS.PCB_SPECS].selectedSpecs,
                [spec.category_id]: value,
              })
            }
            required
          />
        ))}
      </FormSection>
    ),

    [STEPS.DESIGN_RULES]: () => (
      <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-8 text-blue-600">
            Select Options for design rules to be followed
          </h2>
          <Button
            variant="secondary"
            onClick={() => generatePDF(formData, apiData.specifications, apiData.designRules,apiData.designOptions)}
            className="h-10"
          >
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>Export PDF</span>
            </div>
          </Button>
        </div>

        <div className="grid gap-8">
          <div className="col-span-3 border-r border-gray-200 pr-6 mb-8">
            <h3 className="text-lg font-semibold mb-6">Select Design Options:</h3>
            <div className="space-y-4">
              {apiData.designOptions.map((option) => (
                <div
                  key={option.design_option_id}
                  className="flex items-center gap-2 cursor-pointer group transition-colors duration-200 p-3 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="h-5 mr-10 w-5"
                    checked={formData[STEPS.DESIGN_RULES].selectedCheckboxes[option.design_option_id] || false}
                    onChange={(e) => {
                      handleFieldChange(STEPS.DESIGN_RULES, "selectedCheckboxes", {
                        ...formData[STEPS.DESIGN_RULES].selectedCheckboxes,
                        [option.design_option_id]: e.target.checked,
                      });
                    }}
                  />
                  <label className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    {option.desing_option_name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
          <RulesComponent rules={apiData.designRules } />

          </div>
          <div className="col-span-9">
            {Object.values(formData[STEPS.DESIGN_RULES].selectedCheckboxes).some(Boolean) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData[STEPS.DESIGN_RULES].acknowledge}
                    onChange={(e) =>
                      handleFieldChange(STEPS.DESIGN_RULES, "acknowledge", e.target.checked)
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    I acknowledge these design rules
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
        </div>
          
  
    ),
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8 px-4">
      {STEP_ORDER.map((stepKey, index) => (
        <div key={stepKey} className="flex items-center flex-1 last:flex-none">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-medium shadow-sm
              ${
                currentStep === index
                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                  : currentStep > index
                  ? "bg-green-400 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-400"
              }
              transition-all duration-200 relative z-10
            `}
          >
            {currentStep > index ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < STEP_ORDER.length - 1 && (
            <div className="flex-1 relative">
              <div
                className={`
                  absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1
                  ${currentStep > index ? "bg-green-400" : "bg-gray-200"}
                  transition-colors duration-300
                `}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-3">
      <Card className="min-h-[600px] mx-auto bg-white/95 backdrop-blur-md shadow-xl">
        <div className="p-8">
          {renderStepIndicator()}

          {loadingStates.initialData ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : errors.initialData ? (
            <div className="text-red-500 text-center p-4">{errors.initialData}</div>
          ) : (
            StepContent[currentStepKey]?.()
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex gap-4">
              {currentStep === STEP_ORDER.length - 1 ? (
                <>
                  {formData[STEPS.DESIGN_RULES].acknowledge && (
                    <Button 
                      variant="primary" 
                      onClick={handleSubmit}
                      disabled={loadingStates.submission}
                    >
                      {loadingStates.submission ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!isCurrentStepValid}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DesignerInterface;