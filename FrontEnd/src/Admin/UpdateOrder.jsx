import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateOrder.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetailsByUser } from "../features/order/orderSlice";
import {
  removeError,
  removeSuccess,
  updateOrderStatus,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
const UpdateOrder = () => {
  const [status, setStatus] = useState("");
  const { id } = useParams();
  const { order, loading: orderLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const {
    success,
    loading: adminLoading,
    error,
  } = useSelector((state) => state.admin);
  const loading = orderLoading || adminLoading;
  const {
    shippingInfo = {},
    orderItems = [],
    totalPrice,
    paymentInfo = {},
    orderStatus,
  } = order;
  useEffect(() => {
    dispatch(getOrderDetailsByUser(id));
  }, [id, dispatch]);

  const paymentStatus = paymentInfo.status === "success" ? "Paid" : "Not Paid";
  const finalOrderStatus =
    paymentStatus === "Not Paid" ? "Cancelled" : orderStatus;

  // updating order status
  const handleUpdateStatus = () => {
    if (!status) {
      toast.error("Please select a status", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return
    }
    dispatch(updateOrderStatus({ id, status }));
  };

  // success
  useEffect(() => {
    if (success) {
      toast.success("Order status update successful", {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      dispatch(getOrderDetailsByUser(id));
    }
  }, [success, dispatch]);

  // error
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [error, dispatch]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={"Update Orders"} />
          <Navbar />
          <div className="order-container">
            <h1 className="order-title">Update Order</h1>
            <div className="order-details">
              <h2>Order Information</h2>
              <p>
                <strong>Order ID : </strong>
                {order._id}
              </p>
              <p>
                <strong>Shipping Address : </strong>
                {`${shippingInfo.address},${shippingInfo.city},${shippingInfo.state},${shippingInfo.country} - ${shippingInfo.pincode}`}
              </p>
              <p>
                <strong>Phone Number : </strong>
                {shippingInfo.phoneNumber}
              </p>
              <p>
                <strong>Order Status : </strong>
                {finalOrderStatus}
              </p>
              <p>
                <strong>Payment Status : </strong>
                {paymentStatus}
              </p>
              <p>
                <strong>Total Price : </strong>
                {totalPrice}/-
              </p>
            </div>

            <div className="order-items">
              <h2>Order Items</h2>
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((items) => (
                    <tr key={items._id}>
                      <td>
                        <img
                          src={items.image}
                          alt="Product Image"
                          className="order-item-image"
                        />
                      </td>
                      <td>{items.name}</td>
                      <td>{items.quantity}</td>
                      <td>{items.price}/-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-status">
              <h2 className="">Update Status</h2>
              <select
                className="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={loading || orderStatus === "Delivered"}
              >
                <option value="">Select Status</option>
                <option value="Shipped">Shipped</option>
                <option value="On The way">On The way</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button
                className="update-button"
                onClick={handleUpdateStatus}
                disabled={loading || !status || orderStatus === "Delivered"}
              >
                Update Status
              </button>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default UpdateOrder;
