import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Home from "../Pages/Home";

const MainRouting = () => {
  return (
    <div>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default MainRouting;
