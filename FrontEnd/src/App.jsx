import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import axios from "axios";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Register from "./user/Register";
import Login from "./user/Login";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/user/userSlice";
import UserDashboard from "./user/UserDashboard";
import Profile from "./user/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProfile from "./user/UpdateProfile";
import UpdatePassword from "./user/UpdatePassword";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Cart from "./Cart/Cart";
import Shipping from "./cart/Shipping";
import OrderConfirm from "./cart/OrderConfirm";
import Payment from "./cart/Payment";
import PaymentSuccess from "./cart/PaymentSuccess";
import MyOrders from "./Orders/MyOrders";
import OrderDetails from "./Orders/OrderDetails";
import Dashboard from "./Admin/Dashboard";
import ProductsList from "./Admin/ProductsList";
import CreateProduct from "./Admin/CreateProduct";
import UpdateProduct from "./Admin/UpdateProduct";
import UsersList from "./Admin/UsersList";
import UpdateRole from "./Admin/UpdateRole";
import OrdersList from "./Admin/OrdersList";
import UpdateOrder from "./Admin/UpdateOrder";
import ReviewsList from "./Admin/ReviewsList";

(axios.defaults.baseURL = "http://localhost:3000"),
  (axios.defaults.withCredentials = true);

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch]);
  return (
    <>
      {/* Creating Routers */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forget" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/profile/update"
          element={<ProtectedRoute element={<UpdateProfile />} />}
        />
        <Route
          path="/password/update"
          element={<ProtectedRoute element={<UpdatePassword />} />}
        />

        <Route
          path="/shipping"
          element={<ProtectedRoute element={<Shipping />} />}
        />

        <Route
          path="/order/confirm"
          element={<ProtectedRoute element={<OrderConfirm />} />}
        />
        <Route
          path="/process/payment"
          element={<ProtectedRoute element={<Payment />} />}
        />

        <Route
          path="/paymentSuccess"
          element={<ProtectedRoute element={<PaymentSuccess />} />}
        />

        <Route
          path="/user/orders"
          element={<ProtectedRoute element={<MyOrders />} />}
        />

        <Route
          path="/order/:id"
          element={<ProtectedRoute element={<OrderDetails />} />}
        />

        <Route path="/cart" element={<Cart />} />

        {/* Admin only routes */}

        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<Dashboard />} adminOnly={true} />}
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute element={<ProductsList />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/products/create"
          element={
            <ProtectedRoute element={<CreateProduct />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/product/update/:id"
          element={
            <ProtectedRoute element={<UpdateProduct />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute element={<UsersList />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute element={<UpdateRole />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute element={<OrdersList />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/order/:id"
          element={
            <ProtectedRoute element={<UpdateOrder />} adminOnly={true} />
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute element={<ReviewsList />} adminOnly={true} />
          }
        />

        
      </Routes>
      {isAuthenticated && <UserDashboard user={user} />}
    </>
  );
};

export default App;
