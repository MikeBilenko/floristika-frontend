import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("logout");
    dispatch(logout());
    dispatch(clearCart());
    Cookies.remove("token");
    toast.success("Logout Successfully");
    return navigate("/");
  }, []);
  return <></>;
};

export default Logout;
