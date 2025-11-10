import React, { useState } from "react";
import "../UserStyles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser, removeError } from "../features/user/userSlice";
const UserDashboard = ({ user }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const {cartItems} = useSelector(state=>state.cart)
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const baseOptions = [
    { name: "Orders", funcName: orders },
    { name: "Account", funcName: account },
    { name: `Cart(${cartItems.length})`, funcName: myCart,isCart:true },
    { name: "Logout", funcName: logout },
  ];

  const options =
    user.role === "admin"
      ? [{ name: "Admin Dashboard", funcName: dashboard }, ...baseOptions]
      : baseOptions;

      
  function orders() {
    navigate("/user/orders");
  }
  function account() {
    navigate("/profile");
  }
  function logout() {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.success("Logout successfull", {
          position: "bottom-right",
          autoClose: 3000,
        });
        dispatch(removeError());
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.message || "Logout failed", {
          position: "bottom-right",
          autoClose: 3000,
        });
      });
  }

  function dashboard() {
    navigate("/admin/dashboard");
  }


  function myCart(){
    navigate('/cart')
  }
  return (
    <>
      <div
        className={`overlay ${menuVisible ? "show" : ""}`}
        onClick={toggleMenu}
      ></div>
      <div className="dashboard-container">
        <div className="profile-header" onClick={toggleMenu}>
          <img
            src={
              user.avatar.url ? user.avatar?.url : "./images/profile-logo.jpg"
            }
            alt="profile-pic"
            className="profile-avatar"
          />
          <span className="profile-name">{user.name || "User"}</span>
        </div>
        {/* profile drop down */}
        {menuVisible && (
          <div className="menu-options">
            {options.map((item) => (
              <button
                key={item.name}
                className={`menu-option-btn ${item.isCart && cartItems.length >0 ? "cart-not-empty":""}`}
                onClick={() => {
                  item.funcName(), toggleMenu();
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;
