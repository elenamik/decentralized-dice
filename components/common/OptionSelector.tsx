import React from "react";

export const OptionSelector: React.FC<{
  options: [];
  onChange: (value: string) => void;
  placeholder: string;
  id: string;
}> = ({ options, placeholder, onChange, id }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <div>
      <div className="text-xs">Household Members</div>
      <select
        className="my-1 w-[154px] border p-2 text-left text-xs text-grey-1"
        name={id}
        id={id}
        onChange={handleChange}
      >
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};
export default OptionSelector;
