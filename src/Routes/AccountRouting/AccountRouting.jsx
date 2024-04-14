import React, { useEffect, useState } from "react";
import AccountWrapper from "../../components/AccountWrapper/AccountWrapper";
import { useDispatch } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";
import axios from "axios";
import { Route, Routes, Outlet } from "react-router-dom";
import Details from "../../Pages/Account/Details";
import Orders from "../../Pages/Account/Orders";
import AddressBook from "../../Pages/Account/AddressBook";
import Company from "../../Pages/Account/Company";
import AddressBookEdit from "../../Pages/Account/AddressBookEdit";
import OrderDetails from "../../Pages/Account/OrderDetails";
import ChangePassword from "../../Pages/Account/ChangePassword";

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
      </Routes>
      <Outlet />
    </div>
  );
};

export default AccountRouting;
