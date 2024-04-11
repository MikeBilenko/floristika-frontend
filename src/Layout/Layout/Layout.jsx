import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Overlay from "../Overlay/Overlay";
import MiniCart from "../MiniCart/MiniCart";
import Container from "../../components/Container/Container";
import "./Layout.scss";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";

const Layout = ({ children }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const toggleOverlay = () => {
    let state = !isOverlayOpen;
    setIsOverlayOpen(state);
  };

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
  }, []);

  // useEffect(() => {
  //   document.body.style.overflow = "hidden";

  //   // Function to handle setting loading state to false and restoring body overflow style
  //   const handleLoadingComplete = () => {
  //     setLoading(false);
  //     document.body.removeAttribute("style");
  //   };

  //   // Check if page content is already loaded
  //   if (document.readyState === "complete") {
  //     handleLoadingComplete();
  //   } else {
  //     // Add event listener to handle page load event
  //     const handleLoad = () => {
  //       handleLoadingComplete();
  //       window.removeEventListener("load", handleLoad);
  //     };

  //     window.addEventListener("load", handleLoad);
  //   }

  //   // Cleanup function
  //   return () => {
  //     document.body.removeAttribute("style");
  //   };
  // }, []);

  return (
    <div>
      {/* {loading && <Loader />} */}

      <div>
        <Header />
        <Container className="page-gaps">{children}</Container>

        <Footer />

        <MiniCart />
        <Overlay />
      </div>
    </div>
  );
};

export default Layout;
