import React from "react";
import "./Radio.scss";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

const Radio = ({ label, value, checkedValue, onChange }) => {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <div
      className={`radio ${value === checkedValue ? "checked" : ""}`}
      onClick={handleChange}
    >
      <div className="radio-inner">
        {value === checkedValue ? (
          <MdRadioButtonChecked />
        ) : (
          <MdRadioButtonUnchecked />
        )}
      </div>
      {label}
    </div>
  );
};

export default Radio;
