import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  helperText?: string;
}

interface RadioProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
}

const Radio: React.FC<RadioProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange && onChange(e.target.value)}
                className="sr-only peer"
              />
              <div
                className={`w-5 h-5 border-2 rounded-full transition-all ${
                  error
                    ? 'border-red-500'
                    : 'border-gray-300 peer-checked:border-primary-600'
                } peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2`}
              >
                {value === option.value && (
                  <div className="w-2.5 h-2.5 bg-primary-600 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
              {option.helperText && (
                <p className="mt-1 text-sm text-gray-500">
                  {option.helperText}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Radio;
