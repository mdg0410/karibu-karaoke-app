import React from 'react';

/**
 * Componente Select personalizado con estilo neumórfico
 */
const Select = ({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  label,
  error,
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  selectClassName = '',
  ariaLabel
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block mb-2 font-medium text-primary-light ${labelClassName}`}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            appearance-none w-full px-4 py-2 bg-karaoke-darkgray text-white 
            rounded-lg shadow-neumorph-inset 
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${error ? 'border border-red-500' : ''}
            ${selectClassName}
          `}
          aria-label={ariaLabel || label || name}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg 
            className="w-5 h-5 text-primary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;