import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowDown,
  ArrowUp,
  Target,
  FileText,
  AlertCircle,
  CheckCircle2,
  Home,
} from "lucide-react";
import {
  Input,
  Select,
  Button,
  Card,
  FormSection,
} from "../../components/common/ReusableComponents";
import {
  pcbAPI,
  componentsAPI,
  verifierAPI,
} from "../../services/api/endpoints";
import { toast } from "react-toastify";
import PageLayout from "../../components/layout/PageLayout";
import generatePDF from "../pdf-creators/PDFDocumentVerifierInterface";
import { useNavigate } from "react-router-dom";

const STEPS = {
  BASIC_INFO: "basicInfo",
  PCB_SPECS: "pcbSpecs",
  VERIFIER_FIELDS: "verifierFields",
  VERIFY_RESULTS: "verifyResults",
};

const STEP_ORDER = [
  STEPS.BASIC_INFO,
  STEPS.PCB_SPECS,
  STEPS.VERIFIER_FIELDS,
  STEPS.VERIFY_RESULTS,
];

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
  [STEPS.VERIFIER_FIELDS]: [],
  [STEPS.VERIFY_RESULTS]: [],
};

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
  [STEPS.VERIFIER_FIELDS]: {
    verifierQueryData: {},
  },
  [STEPS.VERIFY_RESULTS]: {},
};

const INPUT_FIELD_SPECS = ["Dielectric Thickness", "B14 Size"];

const VerifierInterface = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormState);
  const [apiData, setApiData] = useState({
    specifications: [],
    components: [],
    verifierFields: [],
    verifyResults: null,
  });
  const [loading, setLoading] = useState({
    initial: true,
    verifierFields: false,
    submission: false,
    results: false,
  });
  const [errors, setErrors] = useState({});
  const [hasVerifierFields, setHasVerifierFields] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  console.log("formData", formData);
  console.log("ApiData", apiData);

  const fetchInitialData = useCallback(async () => {
    try {
      const [specs, components] = await Promise.all([
        pcbAPI.getSpecification(1, "reviewer"),
        componentsAPI.getAll(),
      ]);
      setApiData((prev) => ({ ...prev, specifications: specs, components }));
    } catch (error) {
      toast.error("Failed to load initial data");
    } finally {
      setLoading((prev) => ({ ...prev, initial: false }));
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchVerifierFields = async () => {
    const selectedSpec = formData[STEPS.PCB_SPECS].selectedSpecs[1];
    if ([110, 111, 113].includes(Number(selectedSpec))) {
      setLoading((prev) => ({ ...prev, verifierFields: true }));
      try {
        const fields = await verifierAPI.getVerifierFields(1, 1, selectedSpec);
        setApiData((prev) => ({ ...prev, verifierFields: fields }));
        setHasVerifierFields(true);
      } catch (error) {
        toast.error("Failed to fetch verifier fields");
        setHasVerifierFields(false);
      } finally {
        setLoading((prev) => ({ ...prev, verifierFields: false }));
      }
    } else {
      setHasVerifierFields(false);
    }
  };

  useEffect(() => {
    if (formData[STEPS.PCB_SPECS].selectedSpecs[1]) {
      fetchVerifierFields();
    }
  }, [formData[STEPS.PCB_SPECS].selectedSpecs[1]]);

  const handleFieldChange = (step, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value,
      },
    }));
  };

  const goHome = () => {
    navigate("/");
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center text-center">
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
            Your PCB verification has been successfully completed.
          </p>

          <div className="flex gap-4 w-full max-w-xs">
            <button
              onClick={() =>
                generatePDF(
                  formData,
                  apiData.verifyResults,
                  apiData.specifications
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

  const handleSubmit = async () => {
    setLoading((prev) => ({ ...prev, submission: true }));
    try {
      const processedSpecs = Object.entries(
        formData[STEPS.PCB_SPECS].selectedSpecs
      ).reduce((acc, [key, value]) => {
        const spec = apiData.specifications.find(
          (s) => s.category_id.toString() === key
        );
        if (spec && INPUT_FIELD_SPECS.includes(spec.category_name)) {
          acc[key] = parseFloat(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});

      const submitData = {
        oppNumber: formData[STEPS.BASIC_INFO].oppNumber,
        opuNumber: formData[STEPS.BASIC_INFO].opuNumber,
        eduNumber: formData[STEPS.BASIC_INFO].eduNumber,
        modelName: formData[STEPS.BASIC_INFO].modelName,
        partNumber: formData[STEPS.BASIC_INFO].partNumber,
        component: formData[STEPS.BASIC_INFO].component,
        revisionNumber: formData[STEPS.BASIC_INFO].revisionNumber,
        componentSpecifications: processedSpecs,
        verifierQueryData: formData[STEPS.VERIFIER_FIELDS].verifierQueryData,
      };

      await verifierAPI.createVerifierTemplate(submitData);
      const results = await verifierAPI.getVerifyResults(submitData);
      setApiData((prev) => ({ ...prev, verifyResults: results.res }));
      setCurrentStep((prev) => prev + 1);
      setSubmitted(true);
      toast.success("Template created successfully!");
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the template"
      );
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  const renderStepContent = () => {
    switch (STEP_ORDER[currentStep]) {
      case STEPS.BASIC_INFO:
        return (
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
              options={apiData.components.map((each) => ({
                value: each.id,
                label: each.component_name,
              }))}
              value={formData[STEPS.BASIC_INFO].component}
              onChange={(value) =>
                handleFieldChange(STEPS.BASIC_INFO, "component", value)
              }
              required
            />
          </FormSection>
        );

      case STEPS.PCB_SPECS:
        return (
          <FormSection title="PCB Specifications">
            {apiData.specifications
              .filter((spec) => !INPUT_FIELD_SPECS.includes(spec.category_name))
              .map((spec) => (
                <Select
                  key={spec.category_id}
                  label={spec.category_name}
                  options={spec.subcategories.map((sub) => ({
                    value: sub.id,
                    label: sub.name,
                  }))}
                  value={
                    formData[STEPS.PCB_SPECS].selectedSpecs[spec.category_id] ||
                    ""
                  }
                  onChange={(value) =>
                    handleFieldChange(STEPS.PCB_SPECS, "selectedSpecs", {
                      ...formData[STEPS.PCB_SPECS].selectedSpecs,
                      [spec.category_id]: value,
                    })
                  }
                  required
                />
              ))}

            {apiData.specifications
              .filter((spec) => INPUT_FIELD_SPECS.includes(spec.category_name))
              .map((spec) => (
                <Input
                  key={spec.category_id}
                  label={`${spec.category_name}${
                    spec.category_name === "Dielectric Thickness"
                      ? " (inches)"
                      : ""
                  }`}
                  type="number"
                  step="0.001"
                  min="0"
                  value={
                    formData[STEPS.PCB_SPECS].selectedSpecs[spec.category_id] ||
                    ""
                  }
                  onChange={(value) => {
                    if (value === "" || !isNaN(value)) {
                      handleFieldChange(STEPS.PCB_SPECS, "selectedSpecs", {
                        ...formData[STEPS.PCB_SPECS].selectedSpecs,
                        [spec.category_id]: value,
                      });
                    }
                  }}
                  required
                />
              ))}
          </FormSection>
        );

      case STEPS.VERIFIER_FIELDS:
        return (
          <FormSection title="Verifier Fields">
            {loading.verifierFields ? (
              <div className="col-span-2 flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : hasVerifierFields ? (
              apiData.verifierFields.map((field) => (
                <Input
                  key={field.id}
                  label={field.field_name}
                  type="number"
                  value={
                    formData[STEPS.VERIFIER_FIELDS].verifierQueryData[
                      field.id
                    ] || ""
                  }
                  onChange={(value) =>
                    handleFieldChange(
                      STEPS.VERIFIER_FIELDS,
                      "verifierQueryData",
                      {
                        ...formData[STEPS.VERIFIER_FIELDS].verifierQueryData,
                        [field.id]: value,
                      }
                    )
                  }
                  required
                />
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center gap-4 py-8">
                <AlertCircle className="w-12 h-12 text-yellow-500" />
                <p className="text-center text-gray-600">
                  No verifier fields available for the selected specifications.
                  <br />
                  You can proceed to the next step.
                </p>
              </div>
            )}
          </FormSection>
        );

      case STEPS.VERIFY_RESULTS:
        return (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button
                variant="secondary"
                onClick={() =>
                  generatePDF(
                    formData,
                    apiData.verifyResults,
                    apiData.specifications
                  )
                }
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </Button>
            </div>

            <FormSection title="Verified Query Data">
              {apiData.verifyResults?.verified_query_data.some(
                (item) => item.is_deviated
              ) && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">
                    Deviated Values
                  </h3>
                  {apiData.verifyResults?.verified_query_data
                    .filter((item) => item.is_deviated)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-red-500 mb-2"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Value: {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {apiData.verifyResults?.verified_query_data.some(
                (item) => !item.is_deviated
              ) && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    Compliant Values
                  </h3>
                  {apiData.verifyResults?.verified_query_data
                    .filter((item) => !item.is_deviated)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-green-500 mb-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Value: {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </FormSection>

            <FormSection title="Verify Design Fields">
              {apiData.verifyResults?.verify_design_fields_data.some(
                (item) => item.is_deviated
              ) && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">
                    Deviated Design Fields
                  </h3>
                  {apiData.verifyResults?.verify_design_fields_data
                    .filter((item) => item.is_deviated)
                    .map((item) => (
                      <div
                        key={item.categor_id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-red-500 mb-2"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Selected: {item.selected_deviation_name}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {apiData.verifyResults?.verify_design_fields_data.some(
                (item) => !item.is_deviated
              ) && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    Compliant Design Fields
                  </h3>
                  {apiData.verifyResults?.verify_design_fields_data
                    .filter((item) => !item.is_deviated)
                    .map((item) => (
                      <div
                        key={item.categor_id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-green-500 mb-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Selected: {item.selected_deviation_name}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </FormSection>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center mb-2 px-4">
      {STEP_ORDER.map((stepKey, index) => (
        <div key={stepKey} className="flex items-center flex-1 last:flex-none">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${
                currentStep === index
                  ? "bg-blue-600 text-white ring-2 ring-blue-100"
                  : currentStep > index
                  ? "bg-green-400 text-white"
                  : "bg-white border border-gray-200 text-gray-400"
              }
            `}
          >
            {currentStep > index ? "✓" : index + 1}
          </div>
          {index < STEP_ORDER.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-gray-200">
              <div
                className={`h-full transition-all duration-300 ${
                  currentStep > index ? "bg-green-400" : ""
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 p-4 sm:p-8 md:p-16">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 w-full max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 md:px-8 py-4 border-b border-neutral-200">
          <div className="w-full text-center">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-6">
              PCB Verifier Interface
            </h1>
            {renderStepIndicator()}
          </div>
        </div>

        <div className="flex-1">
          <div className="px-4 sm:px-6 md:px-8 py-6">
            {loading.initial ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : (
              renderStepContent()
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-4 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep < STEP_ORDER.length - 1 && (
              <Button
                variant="primary"
                onClick={
                  currentStep === STEP_ORDER.length - 2
                    ? handleSubmit
                    : () => setCurrentStep((prev) => prev + 1)
                }
                disabled={loading.submission}
              >
                {loading.submission ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Submitting...</span>
                  </div>
                ) : currentStep === STEP_ORDER.length - 2 ? (
                  "Submit"
                ) : (
                  "Next"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      {submitted && <SuccessModal />}
    </div>
  );
};

export default VerifierInterface;
