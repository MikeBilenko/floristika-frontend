import React, { useEffect, useState, useMemo } from "react";
import AccountWrapper from "../../components/AccountWrapper/AccountWrapper";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";
import axios from "axios";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import countryList from "react-select-country-list";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddressBookEdit = () => {
  const options = useMemo(() => countryList().getData(), []);
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

  const validatePhone = (phone) => {
    const countryCodeRegex = /^\+\d{1,3}\d{9}$/;
    return countryCodeRegex.test(phone);
  };
  const { t } = useTranslation();
  const { id } = useParams();
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    address: "",
    postal_code: "",
    city: "",
    country: "",
    phone: "",
  });
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [countrySpellError, setCountrySpellError] = useState(false);
  const [possibleCountry, setPossibleCountry] = useState("");
  useEffect(() => {
    if (id && token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/address-book/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let coun = options.find(
              (item) => item.value === response.data.country
            ).label;
            setUser({
              ...response.data,
              country: options.find(
                (item) => item.value === response.data.country
              ).label,
            });
          }
        });
    }
  }, [id, token]);

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
    if (validatePhone(user.phone)) {
      setPhoneError(true);
      error = true;
    } else {
      setPhoneError(false);
    }
    if (user.address.length <= 0) {
      setAddressError(true);
      error = true;
    } else {
      setAddressError(false);
    }
    if (user.city.length <= 0) {
      setCityError(true);
      error = true;
    } else {
      setCityError(false);
    }
    if (user.postal_code.length <= 0) {
      setPostalCodeError(true);
      error = true;
    } else {
      setPostalCodeError(false);
    }

    if (error) return;

    country_ = options.find((item) => item.label === country_).value;
    user.country = country_;

    if (!id) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/users/address-book/`,
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
          if (response.status === 200 || response.status === 201) {
            toast.success(t("messages.success.auth.details"));
            navigate("/accounts/account/address-book/");
          }
        });
    } else {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/users/address-book/`,
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
          if (response.status === 200 || response.status === 201) {
            toast.success(t("messages.success.auth.details"));
            navigate("/accounts/account/address-book/");
          }
        });
    }
  };
  return (
    <AccountWrapper>
      <div className="account-header">
        <img src="/accounts/icons/book.svg" />
        {t("auth.address_book")}
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
          value={user.phone}
          onChange={(e) =>
            setUser((prevUser) => {
              return { ...prevUser, phone: e };
            })
          }
          error={phoneError}
          error_message={t("messages.errors.auth.phone_number")}
        />
        <Button>{t("save").toUpperCase()}</Button>
      </form>
    </AccountWrapper>
  );
};

export default AddressBookEdit;
