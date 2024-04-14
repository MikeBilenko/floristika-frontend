import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Contacts from "../../Pages/Contacts/Contacts";

const ContactsRouting = () => {
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
