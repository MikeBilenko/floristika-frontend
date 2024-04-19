import NotFound from "Pages/NotFound";
import DeliveryReturn from "Pages/Policies/DeliveryReturn";
import PrivacyPolicy from "Pages/Policies/PrivacyPolicy";
import TermsConditions from "Pages/Policies/TermsConditions";
import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";

const PoliciesRouting = () => {
  return (
    <div>
      <Routes>
        <Route path="privacy-policy/" element={<PrivacyPolicy />} />
        <Route path="terms-conditions/" element={<TermsConditions />} />
        <Route path="delivery-return/" element={<DeliveryReturn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default PoliciesRouting;
