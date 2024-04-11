import React, { useState } from "react";
import "./Select.scss";
import { TfiAngleDown } from "react-icons/tfi";
import { useTranslation } from "react-i18next";

const Select = ({ options, value, setValue }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);

  return (
    <div
      className="select"
      onClick={() => {
        setActive(!active);
      }}
    >
      <div className={["selected", active ? "active" : ""].join(" ")}>
        {value &&
          options &&
          t(options.find((option) => option.key === value).value)}{" "}
        <TfiAngleDown />
      </div>
      <div className={["options-list", active ? "active" : ""].join(" ")}>
        {options &&
          options.map((option) => (
            <div
              className={[
                "option",
                value === option.key ? "selected" : "",
              ].join(" ")}
              key={option.key}
              onClick={() => {
                setValue(option.key);
                setActive(false);
              }}
            >
              {t(option.value)}
              {value === option.key && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_53_3374)">
                    <path
                      d="M17 9L10.75 16L7 11.8"
                      stroke="#050505"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_53_3374">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Select;
