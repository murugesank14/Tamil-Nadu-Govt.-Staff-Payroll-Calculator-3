import React from 'react';

// Fix: Make the Input component polymorphic to support rendering as a textarea.
type InputAsProp = {
  as?: 'input';
};
type TextareaAsProp = {
  as: 'textarea';
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & InputAsProp;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextareaAsProp;

type PolymorphicInputProps = InputProps | TextareaProps;

export const Input: React.FC<PolymorphicInputProps> = ({ className, ...props }) => {
  const commonClasses = `mt-1 block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${className || ''}`;

  if (props.as === 'textarea') {
    const { as, ...rest } = props;
    return <textarea className={commonClasses} {...rest} />;
  }

  // Default to input element
  const { as, ...rest } = props as InputProps;
  return (
    <input
      className={commonClasses}
      {...rest}
    />
  );
};
