import React, { useEffect } from "react";
import "../OrderStyles/OrderDetails.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetailsByUser } from "../features/order/orderSlice";
const OrderDetails = () => {
  const { id } = useParams();
  const { order } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  console.log(order);

 
  useEffect(() => {
    dispatch(getOrderDetailsByUser(id));
  }, [dispatch,id]);


  const {itemPrice,orderItems=[],orderStatus,paidAt,paymentInfo={},shippingInfo={},shippingPrice,taxPrice,totalPrice} = order;

  const paymentStatus = paymentInfo?.status === "success" ? "Paid" : "Not Paid";
  const finalOrderStatus = paymentStatus === "Not Paid" ? "Cancelled" : orderStatus;

  const orderStatusClass = finalOrderStatus === "Delivered" ? "status-tag delivered" : `status-tag ${finalOrderStatus.toLowerCase()}`

  const paymentStatusClass = `pay-tag ${paymentStatus === "Paid" ? "paid" : "not-paid"}`
  return (
    <>
      <PageTitle title={"Order Details"} />
      <Navbar />
      <div className="order-box">
        {/* order items table */}
        <div className="table-block">
          <h2 className="table-title">Order Items</h2>
          <table className="table-main">
            <thead>
              <tr className="table-row">
                <th className="head-cell">Image</th>
                <th className="head-cell">Name</th>
                <th className="head-cell">Quantity</th>
                <th className="head-cell">Price</th>
              </tr>
            </thead>
            <tbody>
          
               {orderItems.map((item)=>( <tr className="table-row" >
                  <td className="table-cell">
                    <img src={`${item.image}`} alt="product-img" className="item-img" />
                  </td>
                  <td className="table-cell">{item.name}</td>
                  <td className="table-cell">{item.quantity}</td>
                  <td className="table-cell">{item.price}/-</td>
                </tr>))}

            </tbody>
          </table>
        </div>

        {/* Shipping info table */}
        <div className="table-block">
          <h2 className="table-title">Shipping Info</h2>
          <table className="table-main">
            <tbody>
              <tr className="table-row">
                <th className="table-cell">Address</th>
                <td className="table-cell">{`${shippingInfo.address},${shippingInfo.city},${shippingInfo.state},${shippingInfo.country} - ${shippingInfo.pincode}`}</td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Phone</th>
                <td className="table-cell">{shippingInfo.phoneNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="table-block">
          <h2 className="table-title">Order Summary</h2>
          <table className="table-main">
            <thead>
              <tr className="table-row">
                <th className="table-cell">Order Status</th>
                <td className="table-cell">
                  <span className={orderStatusClass}>{finalOrderStatus}</span>
                </td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Payment Status</th>
              <td className="table-cell">
                  <span className={paymentStatusClass}>{paymentStatus}</span>
                </td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Paid At</th>
                <td className="table-cell">{new Date(paidAt).toLocaleString()}</td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Item Price</th>
                <td className="table-cell">{itemPrice}/-</td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Tax Price</th>
                <td className="table-cell">{taxPrice}/-</td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Shipping Price</th>
                <td className="table-cell">{shippingPrice}/-</td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Total Price</th>
                <td className="table-cell">{totalPrice}/-</td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;
