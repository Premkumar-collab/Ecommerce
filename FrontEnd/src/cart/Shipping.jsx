import React, { useEffect, useState } from "react";
import "../CartStyles/Shipping.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
const Shipping = () => {
  const { ShippingInfo } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  // shipping info submit
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast.error("Invalid Phone number ! It should be 10 digits", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    dispatch(
      saveShippingInfo({ address, phoneNumber, pinCode, country, state, city })
    );
    navigate("/order/confirm");
  };

  useEffect(() => {
  if (ShippingInfo) {
    setAddress(ShippingInfo.address || "");
    setPinCode(ShippingInfo.pinCode || "");
    setPhoneNumber(ShippingInfo.phoneNumber || "");
    setCountry(ShippingInfo.country || "");
    setState(ShippingInfo.state || "");
    setCity(ShippingInfo.city || "");
  }
}, [ShippingInfo]);

  return (
    <>
      <PageTitle title={"Shipping page"} />
      <Navbar />
      <CheckoutPath activePath={0} />
      <div className="shipping-form-container">
        <h2 className="shipping-form-header">Shipping Details</h2>
        <form className="shipping-form" onSubmit={handleShippingSubmit}>
          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="shipping-form-group">
              <label htmlFor="pinCode">PinCode</label>
              <input
                type="number"
                id="pinCode"
                name="pinCode"
                placeholder="Enter your pincode"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
            <div className="shipping-form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="country">Country</label>
              <select
                name="country"
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setState("");
                  setCity("");
                }}
              >
                <option value="">Select a Country</option>
                {Country &&
                  Country.getAllCountries().map((country) => (
                    <option value={country.isoCode} key={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div className="shipping-form-group">
                <label htmlFor="state">State</label>
                <select
                  name="state"
                  id="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity("");
                  }}
                >
                  <option value="">Select a State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((state) => (
                      <option value={state.isoCode} key={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {state && (
              <div className="shipping-form-group">
                <label htmlFor="city">City</label>
                <select
                  name="city"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Select a City</option>
                  {City &&
                    City.getCitiesOfState(country, state).map((city) => (
                      <option value={city.name} key={city.name}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          <button
            className="shipping-submit-btn"
            disabled={
              !address ||
              !pinCode ||
              phoneNumber.length !== 10 ||
              !country ||
              !state ||
              !city
            }
          >
            Continue
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Shipping;
