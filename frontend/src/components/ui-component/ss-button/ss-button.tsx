import { FC } from "react";

interface SSButtonProps {
  text: string;
  isLoading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const SSButton: FC<SSButtonProps> = ({
  text,
  isLoading = false,
  onClick,
  type = "button",
  className = "",
  disabled,
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        group
        relative
        flex
        w-full
        items-center
        justify-center
        gap-2
        overflow-hidden
        rounded-xl
        bg-gradient-to-r
        from-indigo-600
        via-indigo-500
        to-purple-600
        px-4
        py-3
        text-sm
        font-semibold
        tracking-wide
        text-white
        shadow-lg
        shadow-indigo-900/30
        transition-all
        duration-300
        hover:-translate-y-[1px]
        hover:from-indigo-500
        hover:via-indigo-400
        hover:to-purple-500
        hover:shadow-indigo-500/30
        active:translate-y-0
        active:scale-[0.99]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-400
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#050816]
        disabled:cursor-not-allowed
        disabled:opacity-60
        disabled:hover:translate-y-0
        disabled:hover:shadow-indigo-900/30
        ${className}
      `}
    >
      {/* Glow Effect */}
      <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute inset-0 bg-white/10"></span>
      </span>

      {/* Loading Spinner */}
      {isLoading && (
        <span
          className="
            h-4
            w-4
            animate-spin
            rounded-full
            border-2
            border-white/30
            border-t-white
          "
        />
      )}

      <span className="relative z-10">{isLoading ? "Loading..." : text}</span>
    </button>
  );
};

export default SSButton;