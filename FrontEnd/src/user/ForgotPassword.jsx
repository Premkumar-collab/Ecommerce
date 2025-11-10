import React, { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../UserStyles/Form.css";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  removeError,
  removeSuccess,
} from "../features/user/userSlice";
import { toast } from "react-toastify";
import Loader from '../components/Loader'
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { loading, error, success, message } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
    setEmail("");
  };

  // Showing error using toast
  useEffect(() => {
    if (error) {
      toast.error(error, { positon: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, error]);

  // Success message
  useEffect(() => {
    if (success) {
      toast.success(message, { positon: "bottom-right", autoClose: 3000 });
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={"Forgot Password"} />
          <Navbar />
          <div className="forgot-container container">
            <div className="form-content email-group">
              <form className="form" onSubmit={handleEmailSubmit}>
                <h2>Forgot Password</h2>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="authBtn">
                  {loading ? "Sending" : "Send"}
                </button>
              </form>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default ForgotPassword;
