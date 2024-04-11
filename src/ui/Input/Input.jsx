import React, { useState } from "react";
import "./Input.scss";
import { IoIosSearch } from "react-icons/io";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const Input = ({
  type,
  value,
  onChange,
  placeholder,
  icon = "",
  label = "",
  error = false,
  error_message = "",
}) => {
  const [inputType, setInputType] = useState(type);

  return (
    <div htmlFor="" className="form-input">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        <input
          type={inputType}
          className={[
            "input",
            type === "search" ? "search" : "",
            error ? "error" : "",
          ].join(" ")}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {icon === "search" && (
          <button className="search-button" type="submit">
            <IoIosSearch />
          </button>
        )}

        {icon === "password" && (
          <button
            className="search-button"
            type="button"
            onClick={() =>
              setInputType(inputType === "password" ? "text" : "password")
            }
          >
            {inputType === "password" && <FaRegEyeSlash />}
            {inputType === "text" && <FaRegEye />}
          </button>
        )}
      </div>
      {error && <span className="error">{error_message}</span>}
    </div>
  );
};

export default Input;
