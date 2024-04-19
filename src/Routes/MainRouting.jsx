import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Home from "../Pages/Home";
import NotFound from "Pages/NotFound";

const MainRouting = () => {
  return (
    <div>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default MainRouting;
