import React, { useEffect } from "react";
import "../OrderStyles/MyOrders.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { LaunchOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../features/order/orderSlice";
const MyOrders = () => {
  const { orders, loading, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  // Errors
  useEffect(() => {
    if (error) {
      toast.error(error.message, { positon: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, error]);

  return (
    <>
      <PageTitle title={"User orders"} />
      <Navbar />
      {loading ? (
        <Loader />
      ) : orders.length > 0 ? (
        <div className="my-orders-container">
          <h1>My Orders</h1>
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items Count</th>
                  <th>Status</th>
                  <th>Total Price</th>
                  <th>View Order</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.orderItems.length}</td>
                    <td>{order.orderStatus}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      <Link to={`/order/${order._id}`} className="order-link">
                        <LaunchOutlined />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="no-orders">
          <p className="no-order-message">No Orders Found</p>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyOrders;
