import React from "react";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import Title from "../../ui/Title/Title";
import ContactsWrapper from "../../components/ContactsPage/ContactsWrapper/ContactsWrapper";

const Contacts = () => {
  return (
    <>
      <BreadCrumbs />
      <Title>CONTACTS</Title>
      <ContactsWrapper />
    </>
  );
};

export default Contacts;
