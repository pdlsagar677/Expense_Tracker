// src/components/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...props 
}) => {
  const baseClasses = "py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  
  const variantClasses = {
    primary: `bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"
    }`,
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {typeof children === 'string' ? 'Processing...' : children}
        </>
      ) : children}
    </button>
  );
};

export default Button;