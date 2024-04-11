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
import { t } from "i18next";

const Company = () => {
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    phone: "",
    city: "",
    address: "",
    postal_code: "",
    city: "",
    country: "",
    company_name: "",
    vat: "",
  });
  const options = useMemo(() => countryList().getData(), []);
  const [vatError, setVatError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [companyError, setCompanyError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [countrySpellError, setCountrySpellError] = useState(false);

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

    for (const country_ of countries) {
      const distance = levenshteinDistance(
        searchTerm.toLowerCase(),
        country_.label.toLowerCase()
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCountry = country_.label;
      }
    }

    return closestCountry;
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/company/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 401) {
          navigate("/accounts/login/");
        }
        setUser({
          id: response.data.id,
          email: response.data.email,
          phone: response.data.phone,
          country: options.find((item) => item.value === response.data.country),
          city: response.data.city,
          address: response.data.address,
          postal_code: response.data.postal_code,
          company_name: response.data.company_name,
          vat: response.data.vat,
        });
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 401) {
          navigate("/accounts/login/");
        }
        if (e.response.status === 404) {
          setUser({
            email: "",
            phone: "",
            city: "",
            address: "",
            postal_code: "",
            city: "",
            country: "",
            company_name: "",
            vat: "",
          });
        }
      });
  }, [token]);

  const delete_comp = (e) => {
    e.preventDefault();
    axios
      .delete(`${process.env.REACT_APP_API_URL}/users/company/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          setUser({
            email: "",
            phone: "",
            city: "",
            address: "",
            postal_code: "",
            city: "",
            country: "",
            company_name: "",
            vat: "",
          });
          toast.success("Company deleted successfully");
        }
      });
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(user);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/company/`,
        {
          ...user,
          country: user.country.value
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
        console.log(response.data);
        if (response.status === 200) {
          setUser({
            email: response.data.email,
            phone: response.data.phone,
            country: options.find(
              (item) => item.value === response.data.country
            ),
            city: response.data.city,
            address: response.data.address,
            postal_code: response.data.postal_code,
            company_name: response.data.company_name,
            vat: response.data.vat,
          });
          toast.success("Company updated successfully");
        }
      });
  };

  return (
    <AccountWrapper>
      <div className="account-header">
        <img src="/accounts/icons/company.svg" />
        {t("company.company")}
      </div>

      {user && (
        <div className="detail-form">
          <Input
            label={`${t("company.company_email")}*`}
            value={user.email}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, email: e };
              })
            }
            error={emailError}
          />
          <Input
            label={`${t("company.compny_phone_number")}*`}
            value={user.phone}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, phone: e };
              })
            }
            error={phoneError}
          />
          <Input
            label={`${t("company.address")}*`}
            value={user.address}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, address: e };
              })
            }
            error={addressError}
          />
          <Input
            label={`${t("company.city")}*`}
            value={user.city}
            onChange={(e) =>
              setUser((prevUser) => {
                console.log(e);
                return { ...prevUser, city: e };
              })
            }
            error={cityError}
          />
          <Input
            label={`${t("company.postal_code")}*`}
            value={user.postal_code}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, postal_code: e };
              })
            }
            error={postalCodeError}
          />
          <Input
            label={`${t("company.country")}*`}
            value={user.country ? user.country.label : ""}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, country: e };
              })
            }
            error={countryError || countrySpellError}
          />
          <Input
            label={`${t("company.name")}*`}
            value={user.company_name}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, company_name: e };
              })
            }
            error={companyError}
          />
          <Input
            label={`${t("company.vat")}*`}
            value={user.vat}
            onChange={(e) =>
              setUser((prevUser) => {
                return { ...prevUser, vat: e };
              })
            }
            error={vatError}
          />
          <p>{t("company.company_text")}</p>
          {findClosestCountry("Latvii")}
          <Button onClick={submit}>{t("company.save_company")}</Button>
          {user.id && (
            <Button onClick={delete_comp} remove>
              {t("company.delete_company")}
            </Button>
          )}
        </div>
      )}
      {/* {user && user.email} */}
    </AccountWrapper>
  );
};

export default Company;
