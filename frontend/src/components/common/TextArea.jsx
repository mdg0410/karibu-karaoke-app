import React from 'react';

/**
 * Componente TextArea personalizado con estilo neumórfico
 */
const TextArea = ({
  id,
  name,
  value,
  onChange,
  placeholder = '',
  label,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  labelClassName = '',
  textareaClassName = '',
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
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`
          w-full px-4 py-2 bg-karaoke-darkgray text-white 
          rounded-lg shadow-neumorph-inset 
          resize-y
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border border-red-500' : ''}
          ${textareaClassName}
        `}
        aria-label={ariaLabel || label || name}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required}
      />
      {error && (
        <p className="mt-2 text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;