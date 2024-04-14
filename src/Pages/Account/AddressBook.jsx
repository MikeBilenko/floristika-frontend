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
  const findClosestCountry = (searchTerm) => {
    const countries = countryList().getData();
    const levenshteinDistance = (s1, s2) => {
      const memo = Array.from({ length: s1.length + 1 }, (_, i) =>
        Array.from({ length: s2.length + 1 }, (_, j) => {
          if (i === 0) return j;
          if (j === 0) return i;
          return 0;
        })
      );

      for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
          const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
          memo[i][j] = Math.min(
            memo[i - 1][j] + 1,
            memo[i][j - 1] + 1,
            memo[i - 1][j - 1] + cost
          );
        }
      }

      return memo[s1.length][s2.length];
    };

    let minDistance = Infinity;
    let closestCountry = null;

    for (const country__ of countries) {
      const distance = levenshteinDistance(
        searchTerm.toLowerCase(),
        country__.label.toLowerCase()
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCountry = country__.label;
      }
    }

    return closestCountry;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePhone = (phone) => {
    const countryCodeRegex = /^\+\d{1,3}\d{9}$/;
    return countryCodeRegex.test(phone);
  };

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

  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [countrySpellError, setCountrySpellError] = useState(false);
  const [possibleCountry, setPossibleCountry] = useState("");

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

          setUser({
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone: response.data.phone,
            country: options.find(
              (item) => item.value === response.data.country
            )
              ? options.find((item) => item.value === response.data.country)
                  .label
              : "",
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
        toast.success(t("messages.success.auth.address_deleted"));
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
    let error = false;

    let country_ = user.country;

    if (user.country.length <= 0) {
      setCountryError(true);
      error = true;
    } else {
      setCountryError(false);
    }
    if (country_ !== findClosestCountry(country_)) {
      setCountrySpellError(true);
      setPossibleCountry(findClosestCountry(country_));
      error = true;
    } else {
      setCountrySpellError(false);
      setPossibleCountry("");
    }
    if (user.email.length <= 0 && validateEmail(user.email)) {
      setEmailError(true);
      error = true;
    } else {
      setEmailError(false);
    }
    if (!user.address_book_phone || validatePhone(user.address_book_phone)) {
      setPhoneError(true);
      error = true;
    } else {
      setPhoneError(false);
    }
    if (!user.address || user.address.length <= 0) {
      setAddressError(true);
      error = true;
    } else {
      setAddressError(false);
    }
    if (!user.city || user.city.length <= 0) {
      setCityError(true);
      error = true;
    } else {
      setCityError(false);
    }
    if (!user.postal_code || user.postal_code.length <= 0) {
      setPostalCodeError(true);
      error = true;
    } else {
      setPostalCodeError(false);
    }

    if (error) return;

    country_ = options.find((item) => item.label === country_).value;
    user.country = country_;

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/users/user/`,
        {
          ...user,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setUser({
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone: response.data.phone,
            country: options.find(
              (item) => item.value === response.data.country
            ).label,
            city: response.data.city,
            address: response.data.address,
            postal_code: response.data.postal_code,
            address_book_phone: response.data.address_book_phone,
            address_books: response.data.address_books,
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

          toast.success(t("messages.success.auth.details"));
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
                <div>{user.country}</div>
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
            error={addressError}
            error_message={t("messages.errors.auth.required")}
          />
          <Input
            label={`${t("auth.city")}:`}
            value={user.city}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, city: e };
              })
            }
            error={cityError}
            error_message={t("messages.errors.auth.required")}
          />
          <Input
            label={`${t("auth.postal_code")}:`}
            value={user.postal_code}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, postal_code: e };
              })
            }
            error={postalCodeError}
            error_message={t("messages.errors.auth.required")}
          />
          <Input
            label={`${t("auth.country")}:`}
            value={user.country}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, country: e };
              })
            }
            error={countryError || countrySpellError}
            error_message={`${
              countryError ? t("messages.errors.auth.required") : ""
            }
                ${
                  countrySpellError
                    ? `${t("messages.errors.auth.country")} ${possibleCountry}`
                    : ""
                }
                `}
          />
          <Input
            label={`${t("auth.phone_number")}:`}
            value={user.address_book_phone}
            placeholder={"e.g. +371 22222222"}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, address_book_phone: e };
              })
            }
            error={phoneError}
            error_message={t("messages.errors.auth.phone_number")}
          />

          <div className="account-info">{t("auth.default_address_book")}</div>
          <Button>{t("save").toUpperCase()}</Button>
        </form>
      )}
    </AccountWrapper>
  );
};

export default AddressBook;
