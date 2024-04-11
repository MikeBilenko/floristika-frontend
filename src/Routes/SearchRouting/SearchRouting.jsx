import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Search from "../../Pages/Search/Search";

const SearchRouting = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Search />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default SearchRouting;
