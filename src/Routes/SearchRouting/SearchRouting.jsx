import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Search from "../../Pages/Search/Search";
import NotFound from "Pages/NotFound";

const SearchRouting = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default SearchRouting;
