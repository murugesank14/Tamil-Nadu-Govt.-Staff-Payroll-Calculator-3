import React from 'react';

const variants = {
  default: "bg-emerald-600 text-white hover:bg-emerald-700",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100",
  ghost: "bg-transparent text-emerald-600 hover:bg-emerald-50",
  icon: "bg-transparent text-gray-500 hover:bg-gray-100",
};

const sizes = {
  default: "h-12 px-6 py-3 text-base",
  sm: "h-9 rounded-md px-3",
  icon: "h-9 w-9",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className,
  variant = 'default',
  size = 'default', 
  ...props 
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};