import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCart, clearCart } from "../../../redux/slices/cartSlice";
import { selectToken, selectUser } from "../../../redux/slices/authSlice";
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
  const { items, productsNumber, totalAmount, totalAuthenticatedAmount } =
    useSelector((state) => state.cart);
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

  useEffect(() => {
    if (productsNumber <= 0) {
      navigate("/cart/");
    }
    axios.get(`${process.env.REACT_APP_API_URL}/stores/`).then((response) => {
      setStores(response.data);
    });
  }, [productsNumber]);

  useEffect(() => {
    // setTimeout(() => {
    if (selectedDelivery) {
      setSelectedStore(null);
    }
    // }, 400);
  }, [selectedDelivery]);

  useEffect(() => {
    // setTimeout(() => {
    console.log(selectedStore, "SELECTED STORE");
    if (selectedStore) {
      console.log(selectedStore);
      setSelectedDelivery(null);
    }
    // }, 400);
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
          setUser(response.data);
          console.log(response.data, "USER DATA");
        });
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/company/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCompanyDiscount(response.data.sale_percent);

          console.log(response.data, "Company data");
        })
        .catch((e) => {
          //
        });
    }
  }, [token]);

  const checkCode = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/discounts/check/`, {
        code: discount,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setDiscountPercent(response.data.discount);
          toast.success("Discount code applied");
        } else {
          toast.error("Invalid discount code");
          setDiscountPercent(0);
          setDiscount("");
        }
      })
      .catch((e) => {
        toast.error("Invalid discount code");
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
            dispatch(clearCart());
            dispatch(clearCart());
            navigate(`/cart/checkout/confirm/success/${response.data.number}/`);
          }
        });
    } else {
      let checkoutItems = items.map((item) => {
        return { product: item.slug, quantity: item.quantity };
      });
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
            dispatch(clearCart());
            navigate(`/cart/checkout/confirm/success/${response.data.number}/`);
            window.scrollTo(0, 0);
          }
        });
    }
  };

  return (
    <div>
      <Title>CONFIRM YOUR ORDER</Title>
      <div className="checkout-confirm-wrapper">
        {!token && (
          <div className="checkout-confirm-wrapper-form">
            <Input label="Name*" value={name} onChange={(e) => setName(e)} />
            <Input
              label="Surname*"
              value={surname}
              onChange={(e) => setSurname(e)}
            />
            <Input label="Email*" value={email} onChange={(e) => setEmail(e)} />
            <Input
              label="Phone Number*"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e)}
            />
            <Input
              label="Address*"
              value={address}
              onChange={(e) => setAddress(e)}
            />
            <Input label="City*" value={city} onChange={(e) => setCity(e)} />
            <Input
              label="Country*"
              value={country}
              onChange={(e) => setCountry(e)}
            />
            <Input
              label="Postal Code *"
              value={postalCode}
              onChange={(e) => setPostalCode(e)}
            />
            <div className="checkout-confirm-wrapper-content">
              <div className="select-delivery-address">
                <div className="info">
                  If you want to pick up from store, please choose one.
                </div>
                <p>You still need to fill-in all fields.</p>
                {stores &&
                  stores.length > 0 &&
                  stores.map((store) => (
                    <Radio
                      key={`delivery_store_${store.id}`}
                      label={`Store ${store.name}: ${store.address}, ${
                        store.postal_code
                      }, ${
                        options.find((item) => item.value === store.country)
                          .label
                      }, ${store.city}, ${store.phone_number}`}
                      value={store.id}
                      checkedValue={selectedStore}
                      onChange={handleStoresRadioChange}
                    />
                  ))}
              </div>
            </div>
            <Button fullWidth onClick={submit}>
              ORDER
            </Button>
          </div>
        )}

        {token && user && user.email && (
          <div className="checkout-confirm-wrapper-content">
            <div className="select-delivery-address">
              <div className="info">
                Please choose one to which you want to deliver.
              </div>
              <p>This is default:</p>
              <Radio
                label={`${user.address}, ${user.postal_code}, ${
                  options.find((item) => item.value === user.country).label
                }, ${user.city}, ${user.address_book_phone}`}
                value="default"
                checkedValue={selectedDelivery}
                onChange={handleRadioChange}
              />
              <p>These ones from address book:</p>
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
              <div className="info">Or you can pickup from store:</div>
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
              <div className="info">
                Please choose one to which you want to be your billing address.
              </div>
              <p>This is default:</p>
              <Radio
                label={`${user.address}, ${user.postal_code}, ${
                  options.find((item) => item.value === user.country).label
                }, ${user.city}, ${user.address_book_phone}`}
                value="default"
                checkedValue={selectedBilling}
                onChange={handleBillingRadioChange}
              />
              <p>These ones from address book:</p>

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
              ORDER
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
                  </span>
                  <span>{item.quantity}</span>
                  <span>
                    €
                    {console.log(
                      item.price -
                        ((item.price -
                          (item.price * item.auth_percent.percent) / 100) *
                          item.sale_percent) /
                          100,
                      item.price,
                      item.auth_percent.percent,
                      item.sale_percent,
                      "price"
                    )}
                    {token
                      ? item.sale
                        ? item.price -
                          ((item.price -
                            (item.price * item.auth_percent.percent) / 100) *
                            item.sale_percent) /
                            100
                        : item.price -
                          (item.price * item.auth_percent.percent) / 100
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
            <Button onClick={checkCode}>APPLY</Button>
          </div>
          <div className="checkout-total">
            <span>TOTAL</span>
            {!token && (
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
            )}
            {token && (
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
            )}
          </div>
          {companyDiscount > 0 && (
            <span className="checkout-total">
              As a company you will recieve {companyDiscount}% to your orders.
              You can see in checkout.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutWrapperConfirm;
