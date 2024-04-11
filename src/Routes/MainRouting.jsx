import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Home from "../Pages/Home";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../redux/slices/authSlice";

const MainRouting = () => {
  const isAuthenticated = useSelector(selectUser); // Access new selector

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
