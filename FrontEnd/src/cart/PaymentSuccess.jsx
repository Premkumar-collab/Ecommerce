import React from "react";
import "../CartStyles/PaymentSuccess.css";
import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  createOrder,
  removeError,
  removeSuccess,
} from "../features/order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const {ShippingInfo,cartItems} = useSelector(state=>state.cart);
  const {loading,success,error} = useSelector(state=>state.order)
  const dispatch = useDispatch();

  useEffect(() => {
    const createOrderData = async()=>{

     try{ 
      const orderItem = JSON.parse(sessionStorage.getItem("orderItem"))
      if(!orderItem) return;
      const orderData = {
        shippingInfo:{
          address:ShippingInfo.address,
          city:ShippingInfo.city,
          state:ShippingInfo.state,
          country:ShippingInfo.country,
          pincode:ShippingInfo.pinCode,
          phoneNumber:ShippingInfo.phoneNumber,
        },
        orderItems:cartItems.map((item)=>({
          name:item.name,
          price:item.price,
          quantity:item.quantity,
          image:item.image,
          product:item.productId,
        })),
        paymentInfo:{
          id:reference,
          status:"success"
        },
        itemPrice:orderItem.subTotal,
        taxPrice:orderItem.tax,
        shippingPrice:orderItem.Shipping,
        totalPrice:orderItem.totalPrice
      }
      console.log("orderdata in paymentSuccess:",orderData);
      dispatch(createOrder(orderData))
      sessionStorage.removeItem("orderItem");
    
    }catch(error){
        toast.error(error,{position:"bottom-right",autoClose:3000})
      }
    }
    createOrderData();
  }, [])


  useEffect(() => {
    if(success){
       toast.success("order successfull",{positon:"bottom-right",autoClose:3000});
            dispatch(removeSuccess());
            dispatch(clearCart());
    }
  }, [dispatch,success])

  useEffect(() => {
    if(error){
       toast.error(error.message,{positon:"bottom-right",autoClose:3000});
            dispatch(removeError());
    }
  }, [dispatch,error])
  
  
  return (
    <>
      <PageTitle title="Payment Success" />
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="payment-success-container">
          <div className="success-content">
            <div className="success-icon">
              <div className="checkmark"></div>
            </div>
            <h1>Order Confirmed!</h1>
            <p>
              Your payment was successful. Reference Id{" "}
              <strong>{reference}</strong>
            </p>
            <Link to={"/user/orders"} className="explore-btn">
              View order
            </Link>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default PaymentSuccess;
