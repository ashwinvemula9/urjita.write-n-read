import React from 'react';

// Text Input Component
const Input = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  required = false,
  error = null,
  placeholder = '',
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = ''
}) => {
  const inputId = id || React.useId();
  
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        required={required}
      />
      {error && <span className={`text-sm text-red-500 ${errorClassName}`}>{error}</span>}
    </div>
  );
};

// Select Component

const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
  error = null,
  placeholder = '',
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  optionClassName = ''
}) => {
  const selectId = id || React.useId();
 
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-md appearance-none
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-blue-500
            [&::-webkit-scrollbar-thumb]:rounded-full
            ${error ? 'border-primary-700' : 'border-gray-300'}
            ${className}
          `}
          required={required}
        >
          <option value="" className={optionClassName}>{placeholder || `Select ${label}`}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className={optionClassName}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && <span className={`text-sm text-red-500 ${errorClassName}`}>{error}</span>}
    </div>
  );
};


// Checkbox Component
const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = ''
}) => (
  <label className={`flex items-center gap-2 cursor-pointer ${containerClassName}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className={`
        w-4 h-4 text-blue-600 
        border-gray-300 rounded 
        focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    />
    <span className={`text-sm text-gray-700 ${labelClassName}`}>{label}</span>
  </label>
);

// Button Component
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  contentClassName = ''
}) => {
  const baseStyles = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-2 text-base',
    large: 'px-8 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <span className={contentClassName}>{children}</span>
    </button>
  );
};

// Card Component
const Card = ({
  children,
  title,
  subtitle,
  gradient = false,
  className = '',
  headerClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  bodyClassName = ''
}) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    {title && (
      <div className={`px-6 py-4 ${gradient ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-blue-600'} ${headerClassName}`}>
        <h2 className={`text-2xl font-bold text-white ${titleClassName}`}>{title}</h2>
        {subtitle && <p className={`mt-1 text-blue-100 ${subtitleClassName}`}>{subtitle}</p>}
      </div>
    )}
    <div className={`p-6 ${bodyClassName}`}>
      {children}
    </div>
  </div>
);

// Form Section Component
const FormSection = ({
  title,
  children,
  className = '',
  titleClassName = '',
  gridClassName = '',
  titleContainerClassName = ''
}) => (
  <div className={`  ${className}`}>
    {title && (
      <div className={`pb-2 ${titleContainerClassName}`}>
        <h3 className={`text-lg font-semibold text-gray-800 ${titleClassName}`}>
          {title}
        </h3>
      </div>
    )}
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${gridClassName}`}>
      {children}
    </div>
  </div>
);

export {
  Input,
  Select,
  Checkbox,
  Button,
  Card,
  FormSection
};