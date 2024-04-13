import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import AccountsRouting from "./Routes/AccountsRouting/AccountsRouting";
import { useDispatch } from "react-redux";
import { validateToken } from "./redux/slices/authSlice";
import Layout from "./Layout/Layout/Layout";
import MainRouting from "./Routes/MainRouting";
import ContactsRouting from "./Routes/ContactsRouting/ContactsRouting";
import ProductRouting from "./Routes/ProductRouting/ProductRouting";
import CartRouting from "./Routes/CartRouting/CartRouting";
import SearchRouting from "./Routes/SearchRouting/SearchRouting";
import PoliciesRouting from "Routes/PolicesRouting/PoliciesRouting";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      dispatch(validateToken(token));
    }
  }, []);

  return (
    <Layout>
      <Routes>
        <Route index element={<MainRouting />} />
        <Route path="/search/*" element={<SearchRouting />} />
        <Route path="/contacts/*" element={<ContactsRouting />} />
        <Route path="/accounts/*" element={<AccountsRouting />} />
        <Route path="/products/*" element={<ProductRouting />} />
        <Route path="/cart/*" element={<CartRouting />} />
        <Route path="/policies/*" element={<PoliciesRouting />} />
      </Routes>
      <Outlet />
    </Layout>
  );
}

export default App;
