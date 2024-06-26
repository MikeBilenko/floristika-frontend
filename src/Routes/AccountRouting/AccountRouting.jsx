import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Details from "../../Pages/Account/Details";
import Orders from "../../Pages/Account/Orders";
import AddressBook from "../../Pages/Account/AddressBook";
import Company from "../../Pages/Account/Company";
import AddressBookEdit from "../../Pages/Account/AddressBookEdit";
import OrderDetails from "../../Pages/Account/OrderDetails";
import ChangePassword from "../../Pages/Account/ChangePassword";
import NotFound from "Pages/NotFound";

const AccountRouting = () => {
  return (
    <div>
      <Routes>
        <Route path="details/" element={<Details />} />
        <Route path="orders/" element={<Orders />} />
        <Route path="orders/:id/" element={<OrderDetails />} />
        <Route path="address-book/" element={<AddressBook />} />
        <Route path="address-book/edit/" element={<AddressBookEdit />} />
        <Route path="address-book/edit/:id/" element={<AddressBookEdit />} />
        <Route path="company/" element={<Company />} />
        <Route path="change-password/" element={<ChangePassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default AccountRouting;
