import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Overlay from "../Overlay/Overlay";
import MiniCart from "../MiniCart/MiniCart";
import Container from "../../components/Container/Container";
import "./Layout.scss";

const Layout = ({ children }) => {
  return (
    <div>
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
