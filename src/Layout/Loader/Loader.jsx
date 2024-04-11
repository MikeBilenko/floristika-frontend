import React, { useEffect } from "react";
import "./Loader.scss";

const Loader = ({ loading }) => {
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("style");
    }
  }, [loading]);
  return (
    loading && (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    )
  );
};

export default Loader;
