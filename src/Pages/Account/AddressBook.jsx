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
import { FaRegAddressBook, FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AddressBook = () => {
  const { t } = useTranslation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    address: "",
    address_books: [],
    postal_code: "",
    city: "",
    country: "",
    address_book_phone: "",
  });
  const [defaultData, setDefultData] = useState(false);
  const options = useMemo(() => countryList().getData(), []);
  useEffect(() => {
    if (token && !user.email) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 401) {
            navigate("/accounts/login/");
          }
          console.log(response.data, "DATA");

          setUser({
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone: response.data.phone,
            country: options.find(
              (item) => item.value === response.data.country
            ),
            address_books: response.data.address_books,
            city: response.data.city,
            address: response.data.address,
            postal_code: response.data.postal_code,
            address_book_phone: response.data.address_book_phone,
          });
          if (
            response.data.address &&
            response.data.address_book_phone &&
            response.data.city &&
            response.data.country &&
            response.data.postal_code
          ) {
            setDefultData(true);
            setEdit(false);
          } else {
            setEdit(false);
            setDefultData(false);
          }
        });
    }
  }, [token, user]);

  const removeAddressBook = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/users/address-book/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 401) {
          navigate("/accounts/login/");
        }
        toast.success("Address book removed successfully");
        setUser((prevUser) => {
          return {
            ...prevUser,
            address_books: prevUser.address_books.filter(
              (item) => item.id !== id
            ),
          };
        });
      });
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(
      {
        ...user,
        country:
          typeof user.country === "string" ? user.country : user.country.label,
      },
      "TEST"
    );
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/users/user/`,
        {
          ...user,
          country:
            typeof user.country === "string"
              ? user.country
              : user.country.label,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data, "data");
        if (response.status === 200) {
          console.log(response.data);
          setUser({
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone: response.data.phone,
            country: options.find(
              (item) => item.value === response.data.country
            ),
            city: response.data.city,
            address: response.data.address,
            postal_code: response.data.postal_code,
            address_book_phone: response.data.address_book_phone,
            address_books: response.data.address_books,
          });
          console.log(
            options.find((item) => item.value === response.data.country)
          );
          if (
            response.data.address &&
            response.data.address_book_phone &&
            response.data.city &&
            response.data.country &&
            response.data.postal_code
          ) {
            setDefultData(true);
            setEdit(false);
          } else {
            setEdit(false);
            setDefultData(false);
          }

          toast.success("Details updated successfully");
        }
      });
  };

  return (
    <AccountWrapper>
      <div className="account-header">
        <img src="/accounts/icons/book.svg" />
        {t("auth.address_book")}
      </div>
      {!edit && user && defaultData && user.address_books.length < 5 && (
        <div className="add-address-book">
          <Button
            fullWidth
            outlined
            icon="create"
            onClick={() => navigate(`/accounts/account/address-book/edit/`)}
          >
            <FaRegAddressBook /> {t("auth.add_address_book")}
          </Button>
        </div>
      )}

      {!edit && user && defaultData && (
        <div className="address-books">
          <div className="address-books-item">
            <div className="address-books-item-details">
              <div className="address-books-item-details-content">
                <div>
                  {user.first_name} {user.last_name}
                </div>
                <div>{user.address}</div>
                <div>{user.city}</div>
                <div>{user.postal_code}</div>
                <div>{user.country.label}</div>
                <div>{user.address_book_phone}</div>
              </div>
              <div
                className="address-books-item-details-actions"
                onClick={() => setEdit(true)}
              >
                {t("buttons.edit").toUpperCase()} <MdEdit />
              </div>
            </div>
            <div className="account-info">
              {t("auth.default_shipping")}
              <br />
              {t("auth.default_billing")}
            </div>
          </div>
          {user.address_books &&
            user.address_books.length > 0 &&
            user.address_books.map((address_book) => (
              <div className="address-books-item" key={`${address_book.id}`}>
                <div className="address-books-item-details">
                  <div className="address-books-item-details-content">
                    <div>{address_book.address}</div>
                    <div>{address_book.city}</div>
                    <div>{address_book.postal_code}</div>
                    <div>
                      {
                        options.find(
                          (item) => item.value === address_book.country
                        ).label
                      }
                    </div>
                    <div>{address_book.phone}</div>
                  </div>
                  <div className="address-books-item-details-actions-list">
                    <div
                      className="address-books-item-details-actions"
                      onClick={() =>
                        navigate(
                          `/accounts/account/address-book/edit/${address_book.id}/`
                        )
                      }
                    >
                      {t("buttons.edit").toUpperCase()} <MdEdit />
                    </div>
                    <div
                      className="address-books-item-details-actions delete"
                      onClick={() => removeAddressBook(address_book.id)}
                    >
                      {t("buttons.delete").toUpperCase()} <FaRegTrashAlt />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {user && (!defaultData || edit) && (
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
            value={user.address_book_phone}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, address_book_phone: e };
              })
            }
          />

          <div className="account-info">{t("auth.default_address_book")}</div>
          <Button>{t("save").toUpperCase()}</Button>
        </form>
      )}
    </AccountWrapper>
  );
};

export default AddressBook;
