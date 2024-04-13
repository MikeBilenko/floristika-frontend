import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import VerifyEmail from "../../Pages/Accounts/VerifyEmail";
import Login from "../../Pages/Accounts/Login";
import Logout from "../../Pages/Accounts/Logout";
import Register from "../../Pages/Accounts/Register";
import ResetPassword from "../../Pages/Accounts/ResetPassowrd";
import ResetPasswordConfirm from "../../Pages/Accounts/ResetPasswordConfirm";
import WishList from "../../Pages/Accounts/WishList";
import AccountRouting from "../AccountRouting/AccountRouting";

const AccountsRouting = () => {
  return (
    <div>
      <Routes>
        <Route path="login/" element={<Login />} />
        <Route path="register/" element={<Register />} />
        <Route path="reset-password/" element={<ResetPassword />} />
        <Route
          path="reset-password-confirm/:uid/:token/"
          element={<ResetPasswordConfirm />}
        />
        <Route path="verify/:token/" element={<VerifyEmail />} />
        <Route path="logout/" element={<Logout />} />
        <Route path="wishlist/" element={<WishList />} />
        <Route path="account/*" element={<AccountRouting />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default AccountsRouting;
