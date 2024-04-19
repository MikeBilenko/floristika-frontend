import React from "react";
import { Link } from "react-router-dom";
import SubTitle from "ui/SubTitle/SubTitle";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>404 Not Found.</h1>
      <SubTitle>
        Something went wrong. Go home: <Link to="/">Home</Link>
      </SubTitle>
    </div>
  );
};

export default NotFound;
