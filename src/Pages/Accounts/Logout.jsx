import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import Cookies from "js-cookie";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("logout");
    dispatch(logout());
    dispatch(clearCart());
    Cookies.remove("token");
    return navigate("/");
  }, []);
  return <></>;
};

export default Logout;
