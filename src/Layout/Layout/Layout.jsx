import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Overlay from "../Overlay/Overlay";
import MiniCart from "../MiniCart/MiniCart";
import Container from "../../components/Container/Container";
import "./Layout.scss";
import Telegram from "./telegram.svg";

const Layout = ({ children }) => {
  return (
    <div className="page">
      <div>
        <Header />
        <img
          src={Telegram}
          alt=""
          className="telegram"
          onClick={() => {
            window.open("https://t.me/floristika_support_bot", "_blank");
          }}
        />
        <Container className="page-gaps">{children}</Container>

        <Footer />

        <MiniCart />
        <Overlay />
      </div>
    </div>
  );
};

export default Layout;
