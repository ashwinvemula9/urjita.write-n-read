import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, UserMinus, Settings, X } from "lucide-react";
import { authAPI } from "../../services/api/endpoints";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// Add User Form Component
const AddUserForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    full_name: "",
    role: [],
  });
  const [errors, setErrors] = useState({
    password: [],
    password2: [],
    email: [],
    general: [],
  });
  const [touched, setTouched] = useState({
    password: false,
    password2: false,
    email: false,
  });
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    return errors;
  };

  const validateConfirmPassword = (password2) => {
    const errors = [];
    if (password2 !== formData.password) {
      errors.push("Passwords do not match");
    }
    return errors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(formData.password),
      }));
    } else if (field === "password2") {
      setErrors((prev) => ({
        ...prev,
        password2: validateConfirmPassword(formData.password2),
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData((prev) => ({ ...prev, password: newPassword }));
    if (touched.password) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(newPassword),
        password2: formData.password2
          ? validateConfirmPassword(formData.password2)
          : [],
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newPassword2 = e.target.value;
    setFormData((prev) => ({ ...prev, password2: newPassword2 }));
    if (touched.password2) {
      setErrors((prev) => ({
        ...prev,
        password2: validateConfirmPassword(newPassword2),
      }));
    }
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.full_name &&
      formData.password &&
      formData.password2 &&
      formData.role.length > 0 &&
      errors.password.length === 0 &&
      errors.password2.length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);
    try {
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        full_name: formData.full_name,
        role: formData.role,
      });
      toast.success("User Added Successfully");
      onClose();
    } catch (err) {
      setLoading(false);

      // If err is an object containing validation errors
      if (typeof err === "object" && err !== null && !(err instanceof Error)) {
        setErrors((prev) => ({
          ...prev,
          ...err,
          // Ensure all error fields are arrays
          password: Array.isArray(err.password)
            ? err.password
            : err.password
            ? [err.password]
            : [],
          email: Array.isArray(err.email)
            ? err.email
            : err.email
            ? [err.email]
            : [],
          general: Array.isArray(err.general)
            ? err.general
            : err.general
            ? [err.general]
            : [],
        }));

        // Set touched state for fields with errors
        setTouched((prev) => ({
          ...prev,
          password: !!err.password,
          email: !!err.email,
        }));

        // Show toast for general errors
        if (err.general) {
          toast.error(err.general[0]);
        }
      } else {
        // Handle non-validation errors
        toast.error(err.message || "An error occurred while adding user");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role.includes(role)
        ? prev.role.filter((r) => r !== role)
        : [...prev.role, role],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Show general errors if any */}
      {errors.general && errors.general.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errors.general.map((error, index) => (
            <p key={index} className="text-sm">
              {error}
            </p>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${
              touched.email && errors.email?.length > 0
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-neutral-300"
            }`}
          required
        />
        {touched.email && errors.email?.length > 0 && (
          <div className="mt-1">
            {errors.email.map((error, index) => (
              <p key={index} className="text-red-500 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={handlePasswordChange}
          onBlur={() => handleBlur("password")}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${
              touched.password && errors.password.length > 0
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-neutral-300"
            }`}
          required
        />
        {touched.password && errors.password.length > 0 && (
          <div className="mt-1">
            {errors.password.map((error, index) => (
              <p key={index} className="text-red-500 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          value={formData.password2}
          onChange={handleConfirmPasswordChange}
          onBlur={() => handleBlur("password2")}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${
              touched.password2 && errors.password2.length > 0
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-neutral-300"
            }`}
          required
        />
        {touched.password2 && errors.password2.length > 0 && (
          <div className="mt-1">
            {errors.password2.map((error, index) => (
              <p key={index} className="text-red-500 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Roles (Select multiple)
        </label>
        <div className="space-y-2">
          {["Designer", "Verifier", "Approver"].map((rol) => (
            <label key={rol} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.role.includes(rol)}
                onChange={() => handleRoleChange(rol)}
                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-neutral-700">{rol}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors
            ${
              loading || !isFormValid()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
        >
          {loading ? "Adding..." : "Add User"}
        </button>
      </div>
    </form>
  );
};

// Feature Card Component (reused from Home page)
const FeatureCard = ({ title, description, icon: Icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-lg border border-neutral-200/50 
               hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer
               group relative overflow-hidden"
  >
    <div
      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
    />

    <div className="relative z-10">
      <div
        className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4
                     group-hover:bg-blue-500/20 transition-colors duration-300"
      >
        <Icon className="w-6 h-6 text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-600 mb-4">{description}</p>
    </div>
  </div>
);

// Main Admin Page Component
const AdminInterface = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const features = [
    {
      title: "Add User",
      description:
        "Create new user accounts with specified roles and permissions.",
      icon: UserPlus,
      action: "add-user",
    },
    {
      title: "Remove User",
      description: "Remove user accounts from the system.",
      icon: UserMinus,
      action: "remove-user",
    },
    {
      title: "More Options Coming Soon",
      description: "Configure system-wide settings and preferences.",
      icon: Settings,
      action: "settings",
    },
  ];

  const handleCardClick = (action) => {
    setActiveModal(action);
  };

  return (
    <div className="bg-neutral-900 min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-neutral-400">Manage users and system settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              onClick={() => handleCardClick(feature.action)}
            />
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={activeModal === "add-user"}
        onClose={() => setActiveModal(null)}
        title="Add New User"
      >
        <AddUserForm onClose={() => setActiveModal(null)} />
      </Modal>

      {/* Placeholder modals for other features */}

      <Modal
        isOpen={activeModal === "remove-user"}
        onClose={() => setActiveModal(null)}
        title="Remove User"
      >
        <p className="text-neutral-600">
          User removal functionality coming soon...
        </p>
      </Modal>

      <Modal
        isOpen={activeModal === "settings"}
        onClose={() => setActiveModal(null)}
        title="System Settings"
      >
        <p className="text-neutral-600">
          Settings functionality coming soon...
        </p>
      </Modal>
    </div>
  );
};

export default AdminInterface;
