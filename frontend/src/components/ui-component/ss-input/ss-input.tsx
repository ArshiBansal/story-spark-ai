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
}: SSInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        htmlFor={name}
        className="
          block
          text-sm
          font-medium
          tracking-wide
          text-gray-300
        "
      >
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
          placeholder={placeholder}
          autoComplete="off"
          className={`
            w-full
            rounded-xl
            border
            bg-[#0F172A]/80
            py-3
            text-sm
            text-gray-100
            placeholder:text-gray-500
            backdrop-blur-sm
            transition-all
            duration-300
            outline-none

            ${icon ? "pl-11" : "pl-4"}

            ${type === "password" ? "pr-12" : "pr-4"}

            ${
              error
                ? `
                  border-red-500/70
                  focus:border-red-500
                  focus:ring-2
                  focus:ring-red-500/20
                `
                : `
                  border-gray-700
                  hover:border-gray-500
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-500/20
                `
            }
          `}
          {...register(name, validation)}
        />

        {/* Password Toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              inset-y-0
              right-0
              flex
              items-center
              pr-4
              text-gray-500
              transition-colors
              duration-300
              hover:text-indigo-400
              focus:outline-none
            "
            aria-label={showPassword ? "Hide password" : "Show password"}
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