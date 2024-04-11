import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./redux/store"; // Import your store
import { Provider } from "react-redux"; // Import Provider
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import i18n from "./i18n";
import { ToastContainer } from "react-toastify";
import "./styles/main.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
    <ToastContainer stacked />
  </I18nextProvider>
);
