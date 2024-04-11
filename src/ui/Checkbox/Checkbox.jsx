import React from "react";
import "./Checkbox.scss";
import { MdCheck } from "react-icons/md";

const Checkbox = ({ label, status, setStatus }) => {
  const toggleCheckbox = () => {
    setStatus(!status);
  };

  return (
    <div
      className={`checkbox ${status ? "checked" : ""}`}
      onClick={toggleCheckbox}
    >
      <div className="checkbox-inner">
        <MdCheck />
      </div>
      {label}
    </div>
  );
};

export default Checkbox;
