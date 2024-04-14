import React from "react";
import "./TextInput.scss";

const TextInput = ({
  value,
  onChange = () => {},
  placeholder,
  label = "",
  error = false,
  error_message = "",
}) => {
  return (
    <div htmlFor="" className="form-input">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        <textarea
          className={["text", error ? "error" : ""].join(" ")}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          value={value}
        ></textarea>
      </div>
      {error && <span className="error">{error_message}</span>}
    </div>
  );
};

export default TextInput;
