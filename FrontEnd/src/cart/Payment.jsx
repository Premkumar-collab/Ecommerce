import React from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import "../CartStyles/Payment.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const Payment = () => {
  const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
  const { user } = useSelector((state) => state.user);
  const { ShippingInfo } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  // complete payment
  const handlePaymentSubmit = async (amount) => {
    try {
      // get razor pay key
      const { data: keyData } = await axios.get("/api/v1/getKey");
      const { key } = keyData;

      // post req
      const { data: orderData } = await axios.post("/api/v1/process/payment", {
        amount,
      });
      const { order } = orderData;

      // impliment razor pay
      const options = {
        key, // Replace with your Razorpay key_id
        amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Bazario",
        description: "Test Transaction",
        order_id: order.id, // This is the order_id created in the backend
        handler: async (response) => {
          const { data } = await axios.post("/api/v1/paymentVerification", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (data.success) {
            navigate(`/paymentSuccess?reference=${data.reference}`);
          } else {
            toast.error(error.message, {
              positon: "bottom-right",
              autoClose: 3000,
            });
          }
        }, // Your success URL
        prefill: {
          name: user.name,
          email: user.email,
          contact: ShippingInfo.phoneNumber,
        },
        theme: {
          color: "#160d0bff",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message, {
        positon: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  
  return (
    <>
      <PageTitle title={"Order Confirm"} />
      <Navbar />
      <CheckoutPath activePath={2} />
      <div className="payment-container">
        <Link to="/order/confirm" className="payment-go-back">
          Go Back
        </Link>
        <button
          className="payment-btn"
          onClick={() => handlePaymentSubmit(orderItem.totalPrice)}
        >
          Pay {orderItem.totalPrice}/-
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
