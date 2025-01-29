import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Home,
} from "lucide-react";
import { approverAPI } from "../../services/api/endpoints";
import {
  Button,
  Card,
  FormSection,
  Input,
  Select,
} from "../../components/common/ReusableComponents";
import Modal from "../../components/common/Modal";
import PageLayout from "../../components/layout/PageLayout";
import generatePDF from "../../pages/pdf-creators/PDFDocumentApproverInterface";

const buttonVariants = {
  success: `
    bg-green-600 hover:bg-green-700 text-white
    border border-green-600
    hover:border-green-700 
    active:bg-green-800
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  danger: `
    bg-red-600 hover:bg-red-700 text-white
    border border-red-600
    hover:border-red-700 
    active:bg-red-800
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  secondary: `
    bg-gray-100 hover:bg-gray-200 text-gray-700 
    border border-gray-300
    hover:border-gray-400 
    active:bg-gray-300
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};

const UpdatedSelect = ({
  label,
  value,
  onChange,
  required,
  options,
  className = "",
}) => (
  <div className={`flex flex-col space-y-2 ${className}`}>
    <label className="text-sm font-medium text-neutral-700 flex items-center">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-2.5 rounded-lg appearance-none
          border border-neutral-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          bg-white
          transition-all duration-200
          pr-10 /* Add padding for the arrow */
        `}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-5 h-5 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);

const ApproverInterface = () => {
  const [formData, setFormData] = useState({
    oppNumber: "",
    opuNumber: "",
    eduNumber: "",
    modelName: "",
    partNumber: "",
    revisionNumber: "",
    component: 1,
  });

  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState({
    verifyDesignFields: {},
    verifiedQueryData: {},
  });
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionType, setActionType] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFetchTemplate = async () => {
    // Validate all required fields
    const requiredFields = [
      "oppNumber",
      "opuNumber",
      "modelName",
      "partNumber",
      "revisionNumber",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await approverAPI.getApproverTemplate(formData);
      setTemplateData(response.res);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (type, id) => {
    setApprovalStatus((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id], // Toggle checkbox state
      },
    }));
  };

  const isAllDeviationsApproved = () => {
    const deviatedDesignFields =
      templateData?.verify_design_fields_data.filter(
        (field) => field.is_deviated
      ) || [];
    const deviatedQueryData =
      templateData?.verified_query_data.filter((field) => field.is_deviated) ||
      [];

    const allDesignFieldsApproved = deviatedDesignFields.every(
      (field) => approvalStatus.verifyDesignFields[field.categor_id]
    );
    const allQueryDataApproved = deviatedQueryData.every(
      (field) => approvalStatus.verifiedQueryData[field.id]
    );

    return allDesignFieldsApproved && allQueryDataApproved;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        componentSpecifications: Object.fromEntries(
          templateData.verify_design_fields_data
            .filter((field) => field.is_deviated)
            .map((field) => [
              field.categor_id,
              {
                selected_deviation_id: field.selected_deviation_id,
                status: approvalStatus.verifyDesignFields[field.categor_id],
              },
            ])
        ),
        approverQueryData: templateData.verified_query_data
          .filter((field) => field.is_deviated)
          .map((field) => ({
            id: field.id,
            status: approvalStatus.verifiedQueryData[field.id],
          })),
        status: "Approved",
        comments: approvalComment,
      };

      await approverAPI.submitApproverTemplate(submitData);
      setActionType("approved");
      setShowSuccessModal(true);
      setApprovalStatus({ verifyDesignFields: {}, verifiedQueryData: {} });
      setShowApprovalModal(false);
    } catch (error) {
      if (error.response?.data) {
        Object.values(error.response.data).forEach((messages) => {
          messages.forEach((message) => toast.error(message));
        });
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAll = async () => {
    // First, set all deviated fields to Rejected
    const updatedApprovalStatus = {
      verifyDesignFields: {},
      verifiedQueryData: {},
    };

    templateData.verify_design_fields_data
      .filter((field) => field.is_deviated)
      .forEach((field) => {
        updatedApprovalStatus.verifyDesignFields[field.categor_id] = "Rejected";
      });

    templateData.verified_query_data
      .filter((field) => field.is_deviated)
      .forEach((field) => {
        updatedApprovalStatus.verifiedQueryData[field.id] = "Rejected";
      });

    setApprovalStatus(updatedApprovalStatus);
    setShowRejectionModal(true);
  };

  const handleRejectSubmit = async () => {
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        componentSpecifications: Object.fromEntries(
          templateData.verify_design_fields_data
            .filter((field) => field.is_deviated)
            .map((field) => [
              field.categor_id,
              {
                selected_deviation_id: field.selected_deviation_id,
                status: approvalStatus.verifyDesignFields[field.categor_id],
              },
            ])
        ),
        approverQueryData: templateData.verified_query_data
          .filter((field) => field.is_deviated)
          .map((field) => ({
            id: field.id,
            status: approvalStatus.verifiedQueryData[field.id],
          })),
        status: "Rejected",
        comments: rejectionComment,
      };

      await approverAPI.submitApproverTemplate(submitData);
      setActionType("rejected");
      setShowSuccessModal(true);
      setApprovalStatus({ verifyDesignFields: {}, verifiedQueryData: {} });
      setShowRejectionModal(false);
      setRejectionComment("");
    } catch (error) {
      if (error.response?.data) {
        Object.values(error.response.data).forEach((messages) => {
          messages.forEach((message) => toast.error(message));
        });
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const pdfData = {
      ...formData,
      approvalComment: approvalComment,
      rejectionComment: rejectionComment,
    };

    const user = JSON.parse(localStorage.getItem("user"));
    generatePDF(pdfData, templateData, actionType, user?.email);

    // Reset states after PDF generation
    // Reset other states as needed
  };
  console.log("templateData", templateData);
  return (
    <div className="min-h-screen bg-neutral-900 p-4 sm:p-8 md:p-16">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 w-full max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 md:px-8 py-6 border-b border-neutral-200">
          <h1 className="text-3xl font-display font-semibold text-neutral-900 text-center">
            PCB Approver Interface
          </h1>
        </div>

        <div className="p-8">
          {!templateData ? (
            <div className="max-w-5xl mx-auto">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-6">
                    <Input
                      label="OPP Number"
                      value={formData.oppNumber}
                      onChange={(value) =>
                        handleInputChange("oppNumber", value)
                      }
                      required
                      placeholder="Enter OPP Number"
                    />
                    <Input
                      label="EDU Number"
                      value={formData.eduNumber}
                      onChange={(value) =>
                        handleInputChange("eduNumber", value)
                      }
                      placeholder="Enter EDU Number"
                    />
                    <Input
                      label="Part Number"
                      value={formData.partNumber}
                      onChange={(value) =>
                        handleInputChange("partNumber", value)
                      }
                      required
                      placeholder="Enter Part Number"
                    />
                  </div>
                  <div className="space-y-6">
                    <Input
                      label="OPU Number"
                      value={formData.opuNumber}
                      onChange={(value) =>
                        handleInputChange("opuNumber", value)
                      }
                      required
                      placeholder="Enter OPU Number"
                    />
                    <Input
                      label="Model Name"
                      value={formData.modelName}
                      onChange={(value) =>
                        handleInputChange("modelName", value)
                      }
                      required
                      placeholder="Enter Model Name"
                    />
                    <Input
                      label="Revision Number"
                      value={formData.revisionNumber}
                      onChange={(value) =>
                        handleInputChange("revisionNumber", value)
                      }
                      required
                      placeholder="Enter Revision Number"
                    />
                  </div>
                </div>

                <div>
                  <UpdatedSelect
                    label="Component"
                    value={formData.component}
                    onChange={(value) => handleInputChange("component", value)}
                    required
                    options={[{ value: 1, label: "B14" }]}
                    className="w-full md:w-1/2"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleFetchTemplate}
                    disabled={loading}
                    className="px-8 py-3 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 
                      disabled:bg-primary-300 disabled:cursor-not-allowed transition-all duration-200 ease-in-out 
                      flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Fetching Template...</span>
                      </>
                    ) : (
                      "Fetch Template"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
                  <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    Deviated Fields
                  </h2>

                  {templateData.verify_design_fields_data.some(
                    (field) => field.is_deviated
                  ) && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Design Fields
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {templateData.verify_design_fields_data
                          .filter((field) => field.is_deviated)
                          .map((field) => (
                            <div
                              key={field.categor_id}
                              className="bg-white rounded-lg border border-red-200 p-4"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                  <h4 className="font-medium text-gray-900">
                                    {field.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Selected Value:{" "}
                                    {field.selected_deviation_name}
                                  </p>
                                </div>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      !!approvalStatus.verifyDesignFields[
                                        field.categor_id
                                      ]
                                    }
                                    onChange={() =>
                                      handleStatusChange(
                                        "verifyDesignFields",
                                        field.categor_id
                                      )
                                    }
                                    className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    Approve
                                  </span>
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {templateData.verified_query_data.some(
                    (field) => field.is_deviated
                  ) && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Query Data
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {templateData.verified_query_data
                          .filter((field) => field.is_deviated)
                          .map((field) => (
                            <div
                              key={field.id}
                              className="bg-white rounded-lg border border-red-200 p-4"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                  <h4 className="font-medium text-gray-900">
                                    {field.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Value: {field.value}
                                  </p>
                                </div>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      !!approvalStatus.verifiedQueryData[
                                        field.id
                                      ]
                                    }
                                    onChange={() =>
                                      handleStatusChange(
                                        "verifiedQueryData",
                                        field.id
                                      )
                                    }
                                    className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    Approve
                                  </span>
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
                  <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" />
                    Compliant Fields
                  </h2>

                  {templateData.verify_design_fields_data.some(
                    (field) => !field.is_deviated
                  ) && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Design Fields
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {templateData.verify_design_fields_data
                          .filter((field) => !field.is_deviated)
                          .map((field) => (
                            <div
                              key={field.categor_id}
                              className="bg-white rounded-lg border border-green-200 p-4"
                            >
                              <h4 className="font-medium text-gray-900">
                                {field.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Selected Value: {field.selected_deviation_name}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {templateData.verified_query_data.some(
                    (field) => !field.is_deviated
                  ) && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Query Data
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {templateData.verified_query_data
                          .filter((field) => !field.is_deviated)
                          .map((field) => (
                            <div
                              key={field.id}
                              className="bg-white rounded-lg border border-green-200 p-4"
                            >
                              <h4 className="font-medium text-gray-900">
                                {field.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Value: {field.value}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  disabled={!isAllDeviationsApproved()}
                  onClick={() => setShowApprovalModal(true)}
                  className="px-6 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve All
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Reject All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Approval Confirmation"
      >
        <div className="p-6">
          <Input
            label="Approval Comment"
            value={approvalComment}
            onChange={setApprovalComment}
            multiline
            required
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowApprovalModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              Confirm Approval
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        title="Rejection Confirmation"
      >
        <div className="p-6">
          <Input
            label="Rejection Comment"
            value={rejectionComment}
            onChange={setRejectionComment}
            multiline
            required
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowRejectionModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRejectSubmit}
              disabled={loading || !rejectionComment.trim()}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={`Template ${
          actionType === "approved" ? "Approved" : "Rejected"
        } Successfully`}
        closeOnOverlayClick={false}
      >
        <div className="p-6">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <p className="text-lg text-center text-gray-700">
              The template has been {actionType} successfully.
            </p>
            <div className="flex gap-4 mt-4">
              <Button
                variant="secondary"
                onClick={handleExportPDF}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </Button>
              <Button
                variant="primary"
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApproverInterface;
