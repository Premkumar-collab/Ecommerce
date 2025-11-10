import React, { useState, useEffect } from "react";
import "../UserStyles/Form.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login, removeSuccess } from "../features/user/userSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const Login = () => {
  const [isLoginEmail, setIsLoginEmail] = useState("");
  const [isLoginPassword, setIsLoginPassword] = useState("");
  const { loading, error, success, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/"

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: isLoginEmail, password: isLoginPassword }));
  };

  // show error
  useEffect(() => {
    if (error) {
      toast.error(error, { positon: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated]);

  // success login
  useEffect(() => {
    if (success) {
      toast.success("Login successfull",{position:"bottom-right",autoClose:3000});
    }
  }, [success]);

  return (
    <>
    <Navbar/>
      <div className="form-container container">
        <div className="form-content">
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={(e) => setIsLoginEmail(e.target.value)}
                value={isLoginEmail}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={(e) => setIsLoginPassword(e.target.value)}
                value={isLoginPassword}
              />
            </div>
            <button className="authBtn">Log In</button>
            <p className="form-links">
              Forgotten Password ?{" "}
              <Link to="/password/forget">Request Here</Link>
            </p>
            <p className="form-links">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Login;
