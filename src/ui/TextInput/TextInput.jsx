import React from "react";
import "./TextInput.scss";

const TextInput = ({ value, onChange = () => {}, placeholder, label = "" }) => {
  return (
    <div htmlFor="" className="form-input">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        <textarea
          className={["text"].join(" ")}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          value={value}
        ></textarea>
      </div>
    </div>
  );
};

export default TextInput;
