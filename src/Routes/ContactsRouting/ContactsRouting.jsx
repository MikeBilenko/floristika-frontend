import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Contacts from "../../Pages/Contacts/Contacts";
import NotFound from "Pages/NotFound";

const ContactsRouting = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Contacts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default ContactsRouting;
