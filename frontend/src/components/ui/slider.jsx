import React from "react";

export const Slider = ({ value, onValueChange, max = 100, step = 1, className = "", ...props }) => {
  const handleChange = (e) => {
    const newValue = [parseFloat(e.target.value)];
    onValueChange?.(newValue);
  };

  return (
    <input
      type="range"
      value={value?.[0] || 0}
      onChange={handleChange}
      max={max}
      step={step}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${className}`}
      {...props}
      style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value?.[0] || 0) / max) * 100}%, #e5e7eb ${((value?.[0] || 0) / max) * 100}%, #e5e7eb 100%)`
      }}
    />
  );
};