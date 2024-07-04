import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../../redux/slices/cartSlice";
import { selectToken } from "../../../redux/slices/authSlice";
import Title from "../../../ui/Title/Title";
import Button from "../../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import Input from "../../../ui/Input/Input";
import "./CheckoutWrapperConfirm.scss";
import axios from "axios";
import { toast } from "react-toastify";
import Radio from "../../../ui/Radio/Radio";
import countryList from "react-select-country-list";
import { useTranslation } from "react-i18next";

const CheckoutWrapperConfirm = () => {
  const { t, i18n } = useTranslation();
  const [discount, setDiscount] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [companyDiscount, setCompanyDiscount] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const options = useMemo(() => countryList().getData(), []);
  const token = useSelector(selectToken);
  const [user, setUser] = useState({});
  const { items, productsNumber, totalAmount } = useSelector(
    (state) => state.cart
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedDelivery, setSelectedDelivery] = useState("default");
  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState("");

  const handleRadioChange = (value) => {
    setSelectedDelivery(value);
  };

  const [selectedBilling, setSelectedBillin] = useState("default");

  const handleBillingRadioChange = (value) => {
    setSelectedBillin(value);
  };

  const handleStoresRadioChange = (value) => {
    setSelectedStore(value);
  };

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
  const [emailError, setEmailError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [countrySpellError, setCountrySpellError] = useState(false);
  const [possibleCountry, setPossibleCountry] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (productsNumber <= 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      navigate("/cart/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/stores/`).then((response) => {
      setStores(response.data);
    });
  }, [productsNumber]);

  useEffect(() => {
    if (selectedDelivery) {
      setSelectedStore(null);
    }
  }, [selectedDelivery]);

  useEffect(() => {
    if (selectedStore) {
      setSelectedDelivery(null);
    }
  }, [selectedStore]);

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const { country, city, postal_code, address_book_phone, address } =
            response.data;
          if (
            !country &&
            !city &&
            !postal_code &&
            !address &&
            !address_book_phone
          ) {
            toast.info(t("messages.info.auth.address_book"));
            navigate(`/accounts/account/address-book/`);
          }

          setUser(response.data);
        });
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/company/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCompanyDiscount(response.data.sale_percent);
        })
        .catch((e) => {
          console.log("Error");
        });
    }
  }, [token, navigate, t]);

  const checkCode = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/discounts/check/`, {
        code: discount,
      })
      .then((response) => {
        if (response.status === 200) {
          setDiscountPercent(response.data.discount);
          toast.success(t("messages.success.discount.applied"));
        } else {
          toast.error(t("messages.errors.discount.invalid"));
          setDiscountPercent(0);
          setDiscount("");
        }
      })
      .catch((e) => {
        toast.error(t("messages.errors.discount.invalid"));
        setDiscountPercent(0);
        setDiscount("");
      });
  };

  const submit = (e) => {
    e.preventDefault();
    if (token) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/orders/order/`,
          {
            companyDiscount: companyDiscount,
            discount: discount,
            shipping: selectedDelivery,
            billing: selectedBilling,
            store: selectedStore,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            navigate(`/cart/checkout/confirm/success/${response.data.number}/`);
            dispatch(clearCart());
          }
        });
    } else {
      let checkoutItems = items.map((item) => {
        return { product: item.slug, quantity: item.quantity };
      });

      e.preventDefault();
      let error = false;
      if (name.length <= 0) {
        setFirstNameError(true);
        error = true;
      } else {
        setFirstNameError(false);
      }
      if (surname.length <= 0) {
        setLastNameError(true);
        error = true;
      } else {
        setLastNameError(false);
      }
      if (!validateEmail(email)) {
        setEmailError(true);
        error = true;
      } else {
        setEmailError(false);
      }
      if (validatePhone(phoneNumber)) {
        setPhoneError(true);
        error = true;
      } else {
        setPhoneError(false);
      }

      let country_ = country;

      if (country.length <= 0) {
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

      if (address.length <= 0) {
        setAddressError(true);
        error = true;
      } else {
        setAddressError(false);
      }
      if (city.length <= 0) {
        setCityError(true);
        error = true;
      } else {
        setCityError(false);
      }
      if (postalCode.length <= 0) {
        setPostalCodeError(true);
        error = true;
      } else {
        setPostalCodeError(false);
      }

      if (error) return;

      country_ = options.find((item) => item.label === country_).value;
      user.country = country_;

      axios
        .post(`${process.env.REACT_APP_API_URL}/orders/order/guest/`, {
          email: email,
          name: name,
          surname: surname,
          phone: phoneNumber,
          address: address,
          city: city,
          country: options.find((item) => item.label === country).value,
          postal_code: postalCode,

          discount: discount,
          items: checkoutItems,
          store: selectedStore,
        })
        .then((response) => {
          console.error(response, "RESPONSE");
          if (response.status === 200 || response.status === 201) {
            navigate(`/cart/checkout/confirm/success/${response.data.number}/`);
            window.scrollTo(0, 0);
            dispatch(clearCart());
          }
        });
    }
  };

  return (
    <div>
      <Title>{t("checkout.confirm_order")}</Title>
      <div className="checkout-confirm-wrapper">
        {!token && (
          <div className="checkout-confirm-wrapper-form">
            <Input
              label={`${t("auth.first_name")}*`}
              error={firstNameError}
              error_message={t("messages.errors.auth.first_name")}
              value={name}
              onChange={(e) => setName(e)}
            />
            <Input
              label={`${t("auth.last_name")}*`}
              value={surname}
              onChange={(e) => setSurname(e)}
              error={lastNameError}
              error_message={t("messages.errors.auth.last_name")}
            />
            <Input
              label={`${t("auth.email")}*`}
              value={email}
              onChange={(e) => setEmail(e)}
              error={emailError}
              error_message={t("messages.errors.auth.email")}
            />
            <Input
              label={`${t("auth.phone_number")}*`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e)}
              error={phoneError}
              placeholder={"e.g. +371 22222222"}
              error_message={t("messages.errors.auth.phone_number")}
            />
            <Input
              label={`${t("auth.address")}*`}
              value={address}
              onChange={(e) => setAddress(e)}
              error={addressError}
              error_message={t("messages.errors.auth.required")}
            />
            <Input
              label={`${t("auth.city")}*`}
              value={city}
              onChange={(e) => setCity(e)}
              error={cityError}
              error_message={t("messages.errors.auth.required")}
            />
            <Input
              label={`${t("auth.country")}*`}
              value={country}
              onChange={(e) => setCountry(e)}
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
              label={`${t("auth.postal_code")}*`}
              value={postalCode}
              onChange={(e) => setPostalCode(e)}
              error={postalCodeError}
              error_message={t("messages.errors.auth.required")}
            />
            <div className="select-delivery-address">
              <div className="info">{t("checkout.pick_from_store")}</div>
              <p>{t("checkout.fill_in")}</p>
              {stores &&
                stores.length > 0 &&
                stores.map((store) => (
                  <Radio
                    key={`delivery_store_${store.id}`}
                    label={`Store ${store.name}: ${store.address}, ${
                      store.postal_code
                    }, ${
                      options.find((item) => item.value === store.country).label
                    }, ${store.city}, ${store.phone_number}`}
                    value={store.id}
                    checkedValue={selectedStore}
                    onChange={handleStoresRadioChange}
                  />
                ))}
            </div>
            <Button fullWidth onClick={submit}>
              {t("checkout.order")}
            </Button>
          </div>
        )}

        {token && user && user.email && (
          <div className="checkout-confirm-wrapper-content">
            <div className="select-delivery-address">
              <div className="info">{t("checkout.choose_delivery")}</div>
              <p>{t("checkout.default")}</p>
              <Radio
                label={`${user.address}, ${user.postal_code}, ${
                  options.find((item) => item.value === user.country).label
                }, ${user.city}, ${user.address_book_phone}`}
                value="default"
                checkedValue={selectedDelivery}
                onChange={handleRadioChange}
              />
              {user.address_books && user.address_books.length > 0 && (
                <p>{t("checkout.from_address_book")}</p>
              )}
              {user.address_books &&
                user.address_books.length > 0 &&
                user.address_books.map((address_book) => (
                  <Radio
                    key={`delivery_address_${address_book.id}`}
                    label={`${address_book.address}, ${
                      address_book.postal_code
                    }, ${
                      options.find(
                        (item) => item.value === address_book.country
                      ).label
                    }, ${address_book.city}, ${address_book.phone}`}
                    value={address_book.id}
                    checkedValue={selectedDelivery}
                    onChange={handleRadioChange}
                  />
                ))}
              <div className="info">{t("checkout.pickup")}</div>
              {stores &&
                stores.length > 0 &&
                stores.map((store) => (
                  <Radio
                    key={`delivery_store_${store.id}`}
                    label={`Store ${store.name}: ${store.address}, ${
                      store.postal_code
                    }, ${
                      options.find((item) => item.value === store.country).label
                    }, ${store.city}, ${store.phone_number}`}
                    value={store.id}
                    checkedValue={selectedStore}
                    onChange={handleStoresRadioChange}
                  />
                ))}
            </div>
            <div className="select-delivery-address">
              <div className="info">{t("checkout.choose_billing")}</div>
              <p>{t("checkout.default")}</p>
              <Radio
                label={`${user.address}, ${user.postal_code}, ${
                  options.find((item) => item.value === user.country).label
                }, ${user.city}, ${user.address_book_phone}`}
                value="default"
                checkedValue={selectedBilling}
                onChange={handleBillingRadioChange}
              />
              {user.address_books && user.address_books.length > 0 && (
                <p>{t("checkout.from_address_book")}</p>
              )}

              {user.address_books &&
                user.address_books.length > 0 &&
                user.address_books.map((address_book) => (
                  <Radio
                    key={`delivery_address_${address_book.id}`}
                    label={`${address_book.address}, ${
                      address_book.postal_code
                    }, ${
                      options.find(
                        (item) => item.value === address_book.country
                      ).label
                    }, ${address_book.city}, ${address_book.phone}`}
                    value={address_book.id}
                    checkedValue={selectedBilling}
                    onChange={handleBillingRadioChange}
                  />
                ))}
            </div>
            <Button fullWidth onClick={submit}>
              {t("checkout.order")}
            </Button>
          </div>
        )}
        <div className="checkout-confirm">
          {items &&
            items.length > 0 &&
            items.map((item) => (
              <div key={`checkout_${item.slug}`} className="checkout-item">
                <img src={item.images[0].image} alt={item.images[0].alt} />
                <div className="checkout-item-text">
                  <span>
                    {i18n.language === "en" && item.name}
                    {i18n.language === "lv" && item.name_lv}
                    {i18n.language === "ru" && item.name_ru}
                    <span>({item.quantity})</span>
                  </span>

                  <span>
                    €
                    {item.sale
                      ? item.price - (item.price * item.sale) / 100
                      : item.price}
                  </span>
                </div>
              </div>
            ))}
          <div className="discount-verification">
            <Input
              label="Discount code"
              value={discount}
              onChange={(e) => setDiscount(e)}
            />
            <Button onClick={checkCode}>{t("filters.apply")}</Button>
          </div>
          <div className="checkout-total">
            <span>{t("cart.total").toUpperCase()}</span>
            {/* {!token && ( */}
            <span className="price">
              {discountPercent === 0 && `€${totalAmount}`}
              {discountPercent > 0 && (
                <>
                  <span style={{ textDecoration: "line-through" }}>
                    €{totalAmount}
                  </span>
                  <span>
                    €{totalAmount - totalAmount * (discountPercent / 100)}
                  </span>
                </>
              )}
            </span>
            {/* )} */}
            {/* {token && (
              <span className="price">
                {discountPercent === 0 && `€${totalAuthenticatedAmount}`}
                {discountPercent > 0 && (
                  <>
                    <span style={{ textDecoration: "line-through" }}>
                      €{totalAuthenticatedAmount}
                    </span>
                    <span>
                      €
                      {totalAuthenticatedAmount -
                        totalAuthenticatedAmount * (discountPercent / 100)}
                    </span>
                  </>
                )}
              </span>
            )} */}
          </div>
          {companyDiscount > 0 && (
            <span className="checkout-total">
              {t("company.discount")}
              {companyDiscount}%.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutWrapperConfirm;
