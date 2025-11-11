import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  label: string;
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  error?: string;
  helperText?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  checked = false,
  onChange,
  error,
  helperText,
}) => {
  return (
    <div className="w-full">
      <label className="flex items-start space-x-3 cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={(e) => onChange && onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div
            className={`w-5 h-5 border-2 rounded transition-all ${
              error
                ? 'border-red-500'
                : 'border-gray-300 peer-checked:border-primary-600 peer-checked:bg-primary-600'
            } peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2`}
          >
            {checked && <Check className="w-4 h-4 text-white absolute" />}
          </div>
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {label}
          </span>
          {helperText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </label>
    </div>
  );
};

export default Checkbox;
