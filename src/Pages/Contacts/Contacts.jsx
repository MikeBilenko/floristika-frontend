import React from "react";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import Title from "../../ui/Title/Title";
import ContactsWrapper from "../../components/ContactsPage/ContactsWrapper/ContactsWrapper";
import { useTranslation } from "react-i18next";

const Contacts = () => {
  const { t } = useTranslation();
  return (
    <>
      <BreadCrumbs />
      <Title>{t("contacts.contacts").toUpperCase()}</Title>
      <ContactsWrapper />
    </>
  );
};

export default Contacts;
