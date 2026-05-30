import { useState } from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
  FieldError,
} from "react-hook-form";

interface SSInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  register: UseFormRegister<T>;
    validation?: RegisterOptions<T>;
    error?: FieldError;
  autoComplete?: string;

}

const SSInput = <T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  register,
  validation,
  error,
  autoComplete,
}: SSInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-400">
        {label}

        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      {/* Input Wrapper */}
      <div className="relative group">
        {/* Left Icon */}
        {icon && (
          <span
            className={`
              absolute
              inset-y-0
              left-0
              flex
              items-center
              pl-4
              transition-colors
              duration-300
              ${
                error
                  ? "text-red-400"
                  : "text-gray-500 group-focus-within:text-indigo-400"
              }
            `}
          >
            <i className={icon}></i>
          </span>
        )}

        {/* Input */}
        <input
          type={inputType}
          id={name}
          className={`w-full pl-8 pr-10 py-1.5 text-base text-gray-200 border rounded-md sm:text-sm ${
          error
          ? "border-red-500 outline-red-500"
          : "border-gray-300 outline-gray-300 focus:outline-indigo-600"
          }`}          placeholder={placeholder}
          {...register(name, validation)}
        />

        {/* Password Toggle */}
        {type === "password" && (
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
  >
    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
  </button>
)}
      </div>

      {/* Error Message */}
      {error && (
        <p
          className="
            flex
            items-center
            gap-1
            text-sm
            text-red-400
            animate-fadeIn
          "
        >
          <i className="fas fa-circle-exclamation text-xs"></i>

          {error.message}
        </p>
      )}
    </div>
  );
};

export default SSInput;