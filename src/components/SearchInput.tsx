import { useState, useEffect } from 'react';

const SearchInput = ({ value, onChange, placeholder, isActive }: any) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <textarea
      value={localValue}
      onChange={(e) => {
        const val = e.target.value;
        setLocalValue(val);
        onChange(val);
      }}
      placeholder={placeholder}
      className="w-full bg-transparent border-none outline-none text-lg resize-none min-h-[100px] placeholder:text-white/30"
    />
  );
};

export default SearchInput;
