import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowDown,
  ArrowUp,
  Target,
  FileText,
  Home,
  PlusCircle,
} from "lucide-react";
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
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { templateAPI } from "../../services/api/endpoints";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// Constants
const STEPS = {
  BASIC_INFO: "basicInfo",
  PCB_SPECS: "pcbSpecs",
  DESIGN_RULES: "designRules",
};

const STEP_ORDER = [STEPS.BASIC_INFO, STEPS.PCB_SPECS, STEPS.DESIGN_RULES];

const REQUIRED_FIELDS = {
  [STEPS.BASIC_INFO]: [
    "oppNumber",
    "opuNumber",
    "modelName",
    "partNumber",
    "component",
    "revisionNumber",
  ],
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
    revisionNumber: "",
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
  designOptions: [],
  designRules: [],
};

// Add this helper function at the top level
const getErrorMessage = (specs) => {
  const copperThickness = specs[6]; // adjust ID as needed
  const finish = specs[5]; // adjust ID as needed
  const secondDielectricThickness = specs[7]; // adjust ID as needed

  if (copperThickness === 76) {
    if (finish && finish !== 75) {
      //no dropdown option with 0 value for second dielectric thickness
      if (secondDielectricThickness === 129) {
        return "Final PCB thickness should be 1 oZ";
      } else if (secondDielectricThickness) {
        return "Final PCB thickness should be 1 oZ + Multilayer thickness + Prepreg thickness as required.";
      }
    }
  } else if (copperThickness === 77) {
    if (finish && finish !== 75) {
      //no dropdown option with 0 value for second dielectric thickness
      if (secondDielectricThickness === 129) {
        return "Final PCB thickness should be 1.5 oZ";
      } else if (secondDielectricThickness) {
        return "Final PCB thickness should be 1.5 oZ + Multilayer thickness + Prepreg thickness as required.";
      }
    }
  }
  return null;
};

// Simplify the PCBSpecifications component
const PCBSpecifications = ({ formData, apiData, handleFieldChange }) => {
  const [subCategoriesTwo, setSubCategoriesTwo] = useState({});
  const [subCategoriesTwoSelections, setSubCategoriesTwoSelections] = useState(
    {}
  );
  const errorMessage = getErrorMessage(formData[STEPS.PCB_SPECS].selectedSpecs);

  // Function to fetch sub-categories-two
  const fetchSubCategoriesTwo = async (subcategoryId) => {
    try {
      const data = await pcbAPI.getSubCategoriesTwo(subcategoryId);
      setSubCategoriesTwo((prev) => ({
        ...prev,
        [subcategoryId]: data,
      }));
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
      toast.error("Failed to fetch sub-categories");
    }
  };

  // Effect to fetch sub-categories-two when a category with sub-categories is selected
  useEffect(() => {
    const selectedSpecs = formData[STEPS.PCB_SPECS].selectedSpecs;

    apiData.specifications.forEach((spec) => {
      const selectedSubcategoryId = selectedSpecs[spec.category_id];
      const selectedSubcategory = spec.subcategories.find(
        (sub) => sub.id === selectedSubcategoryId
      );

      if (
        selectedSubcategory?.is_sub_2_categories_exists &&
        !subCategoriesTwo[selectedSubcategoryId]
      ) {
        fetchSubCategoriesTwo(selectedSubcategoryId);
      }
    });
  }, [formData[STEPS.PCB_SPECS].selectedSpecs]);

  return (
    <FormSection
      title="PCB Specifications"
      className="space-y-2"
      gridClassName="grid-cols-1 gap-2"
    >
      {apiData.specifications.map((spec) => {
        const selectedSubcategoryId = Number(
          formData[STEPS.PCB_SPECS].selectedSpecs[spec.category_id]
        );
        const selectedSubcategory = spec.subcategories.find(
          (sub) => sub.id === selectedSubcategoryId
        );

        return (
          <Card
            key={spec.category_id}
            className="border border-gray-200 shadow-sm"
            bodyClassName="p-3"
          >
            <div className="space-y-2">
              {/* Main category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {spec.category_name}
                  {spec.category_name !== "Second Dielectric Thickness" && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <Select
                  options={spec.subcategories.map((sub) => ({
                    value: sub.id,
                    label: sub.name,
                  }))}
                  value={selectedSubcategoryId || ""}
                  onChange={(value) => {
                    handleFieldChange(STEPS.PCB_SPECS, "selectedSpecs", {
                      ...formData[STEPS.PCB_SPECS].selectedSpecs,
                      [spec.category_id]: Number(value),
                    });
                  }}
                  required={
                    spec.category_name !== "Second Dielectric Thickness"
                  }
                  placeholder={`Select ${spec.category_name}`}
                  className="min-h-[36px]"
                />
              </div>

              {/* Sub-categories-two section */}
              {selectedSubcategory?.is_sub_2_categories_exists &&
                subCategoriesTwo[selectedSubcategoryId] && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedSubcategory.name}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Select
                          options={subCategoriesTwo[selectedSubcategoryId].map(
                            (option) => ({
                              value: option.id,
                              label: option.sub_2_category_name,
                            })
                          )}
                          value={
                            subCategoriesTwoSelections[
                              `${selectedSubcategoryId}`
                            ] || ""
                          }
                          onChange={(value) => {
                            setSubCategoriesTwoSelections((prev) => ({
                              ...prev,
                              [`${selectedSubcategoryId}`]: value,
                            }));
                          }}
                          required
                          placeholder={`Select`}
                          className="min-h-[36px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </Card>
        );
      })}

      {/* Error message display */}
      {errorMessage && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      )}
    </FormSection>
  );
};

const DesignerInterface = () => {
  // Form State
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormState);
  const [isDirty, setIsDirty] = useState(false);

  // API Data State
  const [apiData, setApiData] = useState(initialApiDataState);
  const [submitted, setSubmitted] = useState(false);

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
  const navigate = useNavigate();
  const [templateExists, setTemplateExists] = useState(false);
  const [checkingTemplate, setCheckingTemplate] = useState(false);

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

  // Fetch Initial Data
  const fetchInitialData = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, initialData: true }));
    setErrors((prev) => ({ ...prev, initialData: null }));

    try {
      const [specs, components] = await Promise.all([
        pcbAPI.getSpecification(1, "designer"),
        componentsAPI.getAll(),
      ]);

      if (!specs || !components) {
        throw new Error("Failed to load initial data");
      }

      setApiData((prev) => ({
        ...prev,
        specifications: specs,
        components,
      }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        initialData: err.message || "Failed to load initial data",
      }));
      toast.error("Failed to load initial data");
    } finally {
      setLoadingStates((prev) => ({ ...prev, initialData: false }));
    }
  }, []);

  const fetchDesignOptions = async () => {
    try {
      const response = await rulesAPI.getDesignOptions();
      setApiData((prev) => ({
        ...prev,
        designOptions: response,
      }));
    } catch (error) {
      console.error("Error fetching design options:", error);
    }
  };

  // Fetch Design Rules
  const fetchDesignRules = useCallback(async () => {
    const selectedOptions = Object.entries(
      formData[STEPS.DESIGN_RULES].selectedCheckboxes
    )
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    if (!selectedOptions.length) return;

    setLoadingStates((prev) => ({ ...prev, rules: true }));
    setErrors((prev) => ({ ...prev, rules: null }));

    try {
      const rules = await rulesAPI.getRules(selectedOptions);
      setApiData((prev) => ({ ...prev, designRules: rules }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        rules: "Failed to load design rules",
      }));
      toast.error("Failed to load design rules. Please try again.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, rules: false }));
    }
  }, [formData[STEPS.DESIGN_RULES].selectedCheckboxes]);

  // Effect Hooks
  useEffect(() => {
    fetchInitialData();
    fetchDesignOptions();
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

      // Check if all required specifications are selected
      const requiredSpecs = apiData.specifications.filter(
        (spec) => spec.category_name !== "Second Dielectric Thickness"
      );

      return requiredSpecs.every(
        (spec) => data.selectedSpecs[spec.category_id] !== undefined
      );
    },
    [STEPS.DESIGN_RULES]: (data) => {
      const hasSelectedOptions = Object.values(data.selectedCheckboxes).some(
        Boolean
      );
      return hasSelectedOptions && data.acknowledge;
    },
  };

  // Event Handlers
  const handleFieldChange = (step, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value,
      },
    }));

    // Reset template existence when any field in basic info changes
    if (step === STEPS.BASIC_INFO) {
      setTemplateExists(false);
    }
  };

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
        .map(([id]) => id),
    };

    try {
      const response = await cadAPI.createTemplate(transformedData);
      toast.success("Successfully submitted!");
      return response;
    } catch (error) {
      console.error("Error creating template:", error);
      throw new Error(error.message || "Failed to create template");
    }
  };

  console.log({ formData });
  console.log({ apiData });

  const handleSubmit = async () => {
    setLoadingStates((prev) => ({ ...prev, submission: true }));
    setErrors((prev) => ({ ...prev, submission: null }));

    try {
      const isValid = STEP_ORDER.every((step) =>
        validators[step](formData[step])
      );
      if (!isValid) {
        throw new Error("Please complete all required fields");
      }

      // Add your submit logic here
      await createTemplate(formData);

      // Reset form on success
      setSubmitted(true);
      generatePDF(
        formData,
        apiData.specifications,
        apiData.designRules,
        apiData.designOptions
      );
      setIsDirty(false);
      localStorage.removeItem("designerFormData");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submission: err.message || "Failed to submit form",
      }));
      toast.error(err.message || "Failed to submit form");
    } finally {
      setLoadingStates((prev) => ({ ...prev, submission: false }));
    }
  };
  const goHome = () => {
    console.log("going home");
    navigate("/");
  };

  const StepContent = {
    [STEPS.BASIC_INFO]: () => (
      <FormSection title="Basic Information">
        <Input
          label="OPP Number"
          value={formData[STEPS.BASIC_INFO].oppNumber}
          onChange={(value) =>
            handleFieldChange(STEPS.BASIC_INFO, "oppNumber", value)
          }
          required
        />
        <Input
          label="OPU Number"
          value={formData[STEPS.BASIC_INFO].opuNumber}
          onChange={(value) =>
            handleFieldChange(STEPS.BASIC_INFO, "opuNumber", value)
          }
          required
        />
        <Input
          label="EDU Number"
          value={formData[STEPS.BASIC_INFO].eduNumber}
          onChange={(value) =>
            handleFieldChange(STEPS.BASIC_INFO, "eduNumber", value)
          }
        />
        <Input
          label="Model Name"
          value={formData[STEPS.BASIC_INFO].modelName}
          onChange={(value) =>
            handleFieldChange(STEPS.BASIC_INFO, "modelName", value)
          }
          required
        />
        <Input
          label="Part Number"
          value={formData[STEPS.BASIC_INFO].partNumber}
          onChange={(value) =>
            handleFieldChange(STEPS.BASIC_INFO, "partNumber", value)
          }
          required
        />
        <Input
          label="Revision Number"
          value={formData[STEPS.BASIC_INFO].revisionNumber}
          onChange={(value) =>
            handleFieldChange(STEPS.BASIC_INFO, "revisionNumber", value)
          }
          required
        />
        <Select
          label="Component"
          options={[{ value: 1, label: "B14" }]}
          value={formData[STEPS.BASIC_INFO].component}
          onChange={(value) =>
            handleFieldChange(STEPS.BASIC_INFO, "component", value)
          }
          required
        />
      </FormSection>
    ),

    [STEPS.PCB_SPECS]: () => (
      <PCBSpecifications
        formData={formData}
        apiData={apiData}
        handleFieldChange={handleFieldChange}
      />
    ),

    [STEPS.DESIGN_RULES]: () => (
      <div className="w-full bg-white rounded-xl">
        <div className="space-y-2">
          <div className="flex justify-between p-3 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-600">
              Select Options for Design Rules
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-1 p-1">
            <div className="col-span-4 h-[500px] overflow-hidden">
              <h3 className="text-lg font-semibold mb-4">Design Options:</h3>
              <div className="overflow-y-auto h-[450px] pr-4 space-y-2">
                {apiData.designOptions.map((option) => (
                  <div
                    key={option.design_option_id}
                    className="flex items-center gap-2 cursor-pointer group transition-colors duration-200 p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                    onClick={() => {
                      const newValue =
                        !formData[STEPS.DESIGN_RULES].selectedCheckboxes[
                          option.design_option_id
                        ];
                      handleFieldChange(
                        STEPS.DESIGN_RULES,
                        "selectedCheckboxes",
                        {
                          ...formData[STEPS.DESIGN_RULES].selectedCheckboxes,
                          [option.design_option_id]: newValue,
                        }
                      );
                    }}
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      checked={
                        formData[STEPS.DESIGN_RULES].selectedCheckboxes[
                          option.design_option_id
                        ] || false
                      }
                      onChange={(e) => {
                        e.stopPropagation();
                        handleFieldChange(
                          STEPS.DESIGN_RULES,
                          "selectedCheckboxes",
                          {
                            ...formData[STEPS.DESIGN_RULES].selectedCheckboxes,
                            [option.design_option_id]: e.target.checked,
                          }
                        );
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
                  <RulesComponent
                    rules={apiData.designRules}
                    selectedCheckboxes
                  />
                </div>

                {Object.values(
                  formData[STEPS.DESIGN_RULES].selectedCheckboxes
                ).some(Boolean) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={formData[STEPS.DESIGN_RULES].acknowledge}
                        onChange={(e) =>
                          handleFieldChange(
                            STEPS.DESIGN_RULES,
                            "acknowledge",
                            e.target.checked
                          )
                        }
                      />
                      <span className="text-sm font-medium text-gray-700">
                        I acknowledge and accept all the design rules specified
                        above
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-4 px-4">
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
              onClick={() =>
                generatePDF(
                  formData,
                  apiData.specifications,
                  apiData.designRules,
                  apiData.designOptions
                )
              }
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

  const checkTemplateExistence = async () => {
    setCheckingTemplate(true);
    try {
      const response = await templateAPI.checkTemplateExists(
        formData[STEPS.BASIC_INFO]
      );
      if (response.designer_exists) {
        setTemplateExists(true);
        toast.error("A template with these details already exists!");
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCheckingTemplate(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-4 sm:p-8 md:p-16">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 w-full max-w-7xl mx-auto">
        {/* Compact Header with integrated step indicator */}
        <div className="px-4 sm:px-6 md:px-8 py-4 border-b border-neutral-200">
          <div className="w-full text-center">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-6">
              PCB Design Configuration Interface
            </h1>
            {renderStepIndicator()}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="px-4 sm:px-6 md:px-8 py-6">
            {loadingStates.initialData ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : errors.initialData ? (
              <div className="text-red-500 text-center p-4">
                {errors.initialData}
              </div>
            ) : currentStepKey === STEPS.DESIGN_RULES ? (
              <div className="w-full bg-white rounded-xl">
                <div className="space-y-2">
                  <div className="flex justify-between p-3 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-blue-600">
                      Select Options for Design Rules
                    </h2>
                  </div>

                  <div className="grid grid-cols-12 gap-1 p-1">
                    <div className="col-span-4 h-[500px] overflow-hidden">
                      <h3 className="text-lg font-semibold mb-4">
                        Design Options:
                      </h3>
                      <div className="overflow-y-auto h-[450px] pr-4 space-y-2">
                        {apiData.designOptions.map((option) => (
                          <div
                            key={option.design_option_id}
                            className="flex items-center gap-2 cursor-pointer group transition-colors duration-200 p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                            onClick={() => {
                              const newValue =
                                !formData[STEPS.DESIGN_RULES]
                                  .selectedCheckboxes[option.design_option_id];
                              handleFieldChange(
                                STEPS.DESIGN_RULES,
                                "selectedCheckboxes",
                                {
                                  ...formData[STEPS.DESIGN_RULES]
                                    .selectedCheckboxes,
                                  [option.design_option_id]: newValue,
                                }
                              );
                            }}
                          >
                            <input
                              type="checkbox"
                              className="h-5 w-5"
                              checked={
                                formData[STEPS.DESIGN_RULES].selectedCheckboxes[
                                  option.design_option_id
                                ] || false
                              }
                              onChange={(e) => {
                                e.stopPropagation();
                                handleFieldChange(
                                  STEPS.DESIGN_RULES,
                                  "selectedCheckboxes",
                                  {
                                    ...formData[STEPS.DESIGN_RULES]
                                      .selectedCheckboxes,
                                    [option.design_option_id]: e.target.checked,
                                  }
                                );
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
                          <RulesComponent
                            rules={apiData.designRules}
                            selectedCheckboxes
                          />
                        </div>

                        {Object.values(
                          formData[STEPS.DESIGN_RULES].selectedCheckboxes
                        ).some(Boolean) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={
                                  formData[STEPS.DESIGN_RULES].acknowledge
                                }
                                onChange={(e) =>
                                  handleFieldChange(
                                    STEPS.DESIGN_RULES,
                                    "acknowledge",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="text-sm font-medium text-gray-700">
                                I acknowledge and accept all the design rules
                                specified above
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
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 md:px-8 py-4 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto flex justify-between">
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
                        <div className="flex items-center justify-center">
                          <LoadingSpinner size="sm" />
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
                  onClick={
                    currentStep === 0
                      ? checkTemplateExistence
                      : () => setCurrentStep((prev) => prev + 1)
                  }
                  disabled={
                    !isCurrentStepValid ||
                    checkingTemplate ||
                    (currentStep === 0 && templateExists)
                  }
                >
                  {checkingTemplate ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Checking...</span>
                    </div>
                  ) : (
                    "Next"
                  )}
                </Button>
              )}
            </div>
          </div>
          {currentStep === 0 && templateExists && (
            <div className="mt-2 text-red-500 text-sm">
              A template with these details already exists. Please modify the
              details
            </div>
          )}
        </div>
      </div>
      {submitted && <SuccessModal />}
    </div>
  );
};

export default DesignerInterface;
