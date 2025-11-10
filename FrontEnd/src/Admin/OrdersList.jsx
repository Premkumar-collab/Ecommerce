import React, { useEffect } from "react";
import "../AdminStyles/OrdersList.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteOrder,
  getAllOrders,
  removeError,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
const OrdersList = () => {
  const { orders, success, error, totalAmount, loading, message } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

 

  const handleDelete = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the order ?"
    );
    if (isConfirmed) {
      dispatch(deleteOrder(id));
    }
  };

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      dispatch(getAllOrders());
    }

    if (error) {
      toast.error(error, { position: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [success, message, error, dispatch]);

   if (orders && orders.length === 0) {
    return (
      <div className="no-orders-container">
        <p>No Orders Found</p>
      </div>
    );
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={"Orders List"} />
          <Navbar />
          <div className="ordersList-container">
            <h1 className="ordersList-title">All Orders</h1>
            <div className="ordersList-table-container">
              <table className="ordersList-table">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>Number of Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order._id}</td>
                      <td
                        className={`order-status ${order.orderStatus.toLowerCase()}`}
                      >
                        {order.orderStatus}
                      </td>
                      <td>{order.totalPrice.toFixed(2)}/-</td>
                      <td>{order.orderItems.length}</td>
                      <td>
                        <Link
                          to={`/admin/order/${order._id}`}
                          className="action-icon edit-icon"
                        >
                          <Edit />
                        </Link>
                        <button
                          className="action-btn delete-icon"
                          onClick={() => handleDelete(order._id)}
                        >
                          <Delete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default OrdersList;
