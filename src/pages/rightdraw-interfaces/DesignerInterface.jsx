import React, { useState, useEffect, useCallback } from "react";
import { ArrowDown, ArrowUp, Target, FileText, Home, PlusCircle } from "lucide-react";
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
import generatePDF from "../pdf-creators/PDFDocumentDesignerInterface";
import { useNavigate } from "react-router-dom";
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
  const [submitted, setSubmitted] = useState(false)

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
  const navigate = useNavigate()

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
        pcbAPI.getSpecification(1,"designer"),
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


      // uncomment this after the real data comes 
      // setApiData(prev => ({
      //   ...prev,
      //   specifications: specs,
      //   components,
      // }));
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
      setSubmitted(true)
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
  const goHome = () => {
    console.log("going home");
    navigate("/")
  }


  
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
          options={[{ value: 1, label: "B14" }]}
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
      <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="space-y-6">
          <div className="flex justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-600">
              Select Options for Design Rules
            </h2>
          </div>
          
          <div className="grid grid-cols-12 gap-6 p-6">
            <div className="col-span-3 border-r border-gray-200 pr-6 mb-8">
              <h3 className="text-lg font-semibold mb-6">Select Design Options:</h3>
              <div className="space-y-4">
                {apiData.designOptions.map((option) => (
                  <div
                    key={option.design_option_id}
                    className="flex items-center gap-2 cursor-pointer group transition-colors duration-200 p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                    onClick={() => {
                      const newValue = !formData[STEPS.DESIGN_RULES].selectedCheckboxes[option.design_option_id];
                      handleFieldChange(STEPS.DESIGN_RULES, "selectedCheckboxes", {
                        ...formData[STEPS.DESIGN_RULES].selectedCheckboxes,
                        [option.design_option_id]: newValue,
                      });
                    }}
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      checked={formData[STEPS.DESIGN_RULES].selectedCheckboxes[option.design_option_id] || false}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent double triggering when clicking checkbox directly
                        handleFieldChange(STEPS.DESIGN_RULES, "selectedCheckboxes", {
                          ...formData[STEPS.DESIGN_RULES].selectedCheckboxes,
                          [option.design_option_id]: e.target.checked,
                        });
                      }}
                    />
                    <label className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-grow">
                      {option.desing_option_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <RulesComponent rules={apiData.designRules} selectedCheckboxes={formData[STEPS.DESIGN_RULES].selectedCheckboxes}/>

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

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Success checkmark animation */}
          <div className="success-checkmark mb-6">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Successfully Submitted!
          </h2>
          <p className="text-gray-600 mb-8">
            Your PCB design configuration has been successfully saved.
          </p>
          
          <div className="flex gap-4 w-full max-w-xs">
            <button
              onClick={() => generatePDF(formData, apiData.specifications, apiData.designRules, apiData.designOptions)}
              className="flex items-center justify-center gap-2 px-4 py-2 w-1/2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={goHome}
              className="flex items-center justify-center gap-2 px-4 py-2 w-1/2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    
      <div className="flex-grow  mx-10 mt-5 ">
        <Card className="mx-auto bg-white/95 backdrop-blur-md shadow-xl">
          <h1 className="text-xl font-bold text-black text-center">PCB Design Configuration Interface</h1>
          
          <div className="p-8">
            {renderStepIndicator()}

            {loadingStates.initialData ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : errors.initialData ? (
              <div className="text-red-500 text-center p-4">{errors.initialData}</div>
            ) : currentStepKey === STEPS.DESIGN_RULES ? (
              <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
                <div className="space-y-6">
                  <div className="flex justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-blue-600">
                      Select Options for Design Rules
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-6 p-6">
                    <div className="col-span-4 h-[500px] overflow-hidden">
                      <h3 className="text-lg font-semibold mb-4">Design Options:</h3>
                      <div className="overflow-y-auto h-[450px] pr-4 space-y-2">
                        {apiData.designOptions.map((option) => (
                          <div
                            key={option.design_option_id}
                            className="flex items-center gap-2 cursor-pointer group transition-colors duration-200 p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                            onClick={() => {
                              const newValue = !formData[STEPS.DESIGN_RULES].selectedCheckboxes[option.design_option_id];
                              handleFieldChange(STEPS.DESIGN_RULES, "selectedCheckboxes", {
                                ...formData[STEPS.DESIGN_RULES].selectedCheckboxes,
                                [option.design_option_id]: newValue,
                              });
                            }}
                          >
                            <input
                              type="checkbox"
                              className="h-5 w-5"
                              checked={formData[STEPS.DESIGN_RULES].selectedCheckboxes[option.design_option_id] || false}
                              onChange={(e) => {
                                e.stopPropagation(); // Prevent double triggering when clicking checkbox directly
                                handleFieldChange(STEPS.DESIGN_RULES, "selectedCheckboxes", {
                                  ...formData[STEPS.DESIGN_RULES].selectedCheckboxes,
                                  [option.design_option_id]: e.target.checked,
                                });
                              }}
                            />
                            <label className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-grow">
                              {option.desing_option_name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="col-span-8 h-[500px] overflow-hidden">
                      <div className="h-full flex flex-col">
                        <div className="flex-grow overflow-y-auto pr-4">
                          <RulesComponent rules={apiData.designRules} selectedCheckboxes />
                        </div>
                        
                        {Object.values(formData[STEPS.DESIGN_RULES].selectedCheckboxes).some(Boolean) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
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
                                I acknowledge and accept all the design rules specified above
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        {submitted && <SuccessModal />}
      </div>

  );
};

export default DesignerInterface;