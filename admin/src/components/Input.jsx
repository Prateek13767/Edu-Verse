import React from 'react'

const Input = ({ label, name, type = "text", value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        name={name}          // <-- IMPORTANT
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border px-3 py-2 rounded-md focus:ring-2 outline-none focus:ring-indigo-500"
      />
    </div>
  );
};

export default Input;
