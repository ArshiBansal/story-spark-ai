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
  autoFocus?: boolean;

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
  autoFocus
}: SSInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);



  const inputType =

    type === "password" ? (showPassword ? "text" : "password") : type;



  return (
    <div className="w-full min-w-0">
      <label htmlFor={name} className="block text-sm font-medium text-gray-400">
        {label}

        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      {/* Input Wrapper */}
      <div className="relative group w-full min-w-0">
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
  className={`w-full box-border pl-8 pr-10 py-1.5 text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-slate-800 border-0 sm:text-sm ${
    error
      ? "outline-red-500"
      : "outline-gray-800 focus:outline-indigo-600"
  }`}
  placeholder={placeholder}
  autoComplete={autoComplete}
  {...register(name, validation)}
/>

        <input
  type={inputType}
  id={name}
  className={`block w-full max-w-full box-border pl-8 ${
    type === "password" ? "pr-0" : "pr-0"
  } py-1.5 text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-slate-800 border rounded-md sm:text-sm ${
    error
      ? "border-red-500"
      : "border-gray-300 focus:outline-indigo-600"
  }`}
  placeholder={placeholder}
  autoComplete={autoComplete}
  {...register(name, validation)}
/>
        {type === "password" && (
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}

    className="absolute inset-y-0 right-2 flex items-center text-gray-500"

    
    aria-label={showPassword ? "Hide password" : "Show password"}
    title={showPassword ? "Hide password" : "Show password"}

  >
    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
  </button>
)}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm mt-1 w-full break-words overflow-hidden">
        {error.message}
        </p>
      )}
    </div>
  );
};

export default SSInput;