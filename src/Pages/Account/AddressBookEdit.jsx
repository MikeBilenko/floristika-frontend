import React, { useEffect, useState, useMemo } from "react";
import AccountWrapper from "../../components/AccountWrapper/AccountWrapper";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";
import axios from "axios";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import countryList from "react-select-country-list";
import { MdEdit } from "react-icons/md";
import { FaRegAddressBook } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddressBookEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  console.log(id);

  const [user, setUser] = useState({
    address: "",
    postal_code: "",
    city: "",
    country: "",
    phone: "",
  });
  useEffect(() => {
    console.log(id, token);
    if (id && token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/address-book/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setUser({
              ...response.data,
              country: options.find(
                (item) => item.value === response.data.country
              ),
            });
          }
        });
    }
  }, [id, token]);
  const options = useMemo(() => countryList().getData(), []);
  const submit = (e) => {
    console.log(user);
    e.preventDefault();
    if (!id) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/users/address-book/`,
          {
            ...user,
            country: options.find((item) => item.label === user.country).value,
            billing: false,
            delivery: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            toast.success("Successfully added address book");
            navigate("/accounts/account/address-book/");
          }
        });
    } else {
      console.log(user);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/users/address-book/`,
          {
            ...user,
            country: user.country.label
              ? user.country.value
              : options.find((item) => item.label === user.country).value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            toast.success("Successfully updated address book");
            navigate("/accounts/account/address-book/");
          }
        });
    }
  };
  return (
    <AccountWrapper>
      <div className="account-header">
        <img src="/accounts/icons/book.svg" />
        Add Address Book
      </div>

      <form className="detail-form" onSubmit={submit}>
        <Input
          label={`${t("auth.address")}:`}
          value={user.address}
          onChange={(e) =>
            setUser((prevUser) => {
              return { ...prevUser, address: e };
            })
          }
        />
        <Input
          label={`${t("auth.city")}:`}
          value={user.city}
          onChange={(e) =>
            setUser((prevUser) => {
              console.log(e);
              return { ...prevUser, city: e };
            })
          }
        />
        <Input
          label={`${t("auth.postal_code")}:`}
          value={user.postal_code}
          onChange={(e) =>
            setUser((prevUser) => {
              return { ...prevUser, postal_code: e };
            })
          }
        />
        <Input
          label={`${t("auth.country")}:`}
          value={user.country ? user.country.label : ""}
          onChange={(e) =>
            setUser((prevUser) => {
              return { ...prevUser, country: e };
            })
          }
        />
        <Input
          label={`${t("auth.phone_number")}:`}
          value={user.phone}
          onChange={(e) =>
            setUser((prevUser) => {
              return { ...prevUser, phone: e };
            })
          }
        />
        <Button>{t("save").toUpperCase()}</Button>
      </form>
    </AccountWrapper>
  );
};

export default AddressBookEdit;
