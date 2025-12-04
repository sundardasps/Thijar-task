import { forwardRef } from "react";
import { INPUT_STYLE } from "../../styles/constents";

const Input = forwardRef(({ className, onChange, onBlur, ...props }, ref) => {
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  const handleBlur = (e) => {
    // Trim value on blur
    e.target.value = e.target.value.trim();
    if (onBlur) onBlur(e);
  };

  return (
    <input
      {...props}
      ref={ref}
      className={`${INPUT_STYLE} ${className}`}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
});

const FloatingInput = forwardRef(
  ({ label, className, onChange, onBlur, ...props }, ref) => {
    const handleChange = (e) => {
      if (onChange) onChange(e);
    };

    const handleBlur = (e) => {
      e.target.value = e.target.value.trim();
      if (onBlur) onBlur(e);
    };

    return (
      <div className="relative w-full">
        <input
          {...props}
          ref={ref}
          placeholder=" "
          className={`${INPUT_STYLE} ${className} peer`}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <label
          className="
          absolute left-3 top-1/2 -translate-y-1/2 
          pointer-events-none transition-all
          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-gray-700
          peer-focus:top-0
          peer-focus:text-xs
          text-blue-900
          bg-white peer-focus:p-1 
          peer-focus:-translate-y-1/2
          peer-not-placeholder-shown:top-0
          peer-not-placeholder-shown:text-xs
          peer-not-placeholder-shown:-translate-y-1/2
        "
        >
          {label}
        </label>
      </div>
    );
  }
);

export { Input, FloatingInput };
