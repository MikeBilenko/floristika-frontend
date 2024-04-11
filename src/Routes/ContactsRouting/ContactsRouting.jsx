import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../redux/slices/authSlice";
import Contacts from "../../Pages/Contacts/Contacts";

const ContactsRouting = () => {
  const isAuthenticated = useSelector(selectUser); // Access new selector
  return (
    <div>
      <Routes>
        <Route path="/" element={<Contacts />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default ContactsRouting;
