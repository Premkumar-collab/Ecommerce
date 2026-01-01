import React, { useState ,useEffect} from "react";
import "../UserStyles/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { register,removeError, removeSuccess } from "../features/user/userSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("./images/profile-logo.jpg");

  const { success, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerInputChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };
const registerSubmit = (e) => {
  e.preventDefault();
  
  if (!name || !email || !password || !avatar) {
    toast.error("Please fill all inputs including an avatar");
    return;
  }

  // Send a plain object, NOT FormData
  const myData = {
    name,
    email,
    password,
    avatar, // This is already the Base64 string
  };

  dispatch(register(myData));
};

  // Showing error using toast
  useEffect(() => {
    if (error) {
      toast.error(error, { positon: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, error]);

  // Remove success
  useEffect(() => {
    if (success) {
      toast.success("Registration Successfull", { positon: "bottom-right", autoClose: 3000 });
      dispatch(removeSuccess());
      navigate('/login')
    }
  }, [dispatch, success]);

  return (
    <>
    <Navbar/>
      <div className="form-container container">
        <div className="form-content">
          <form
            className="form"
            onSubmit={registerSubmit}
            encType="multipart/form-data"
          >
            <h2>Sign Up</h2>
            <div className="input-group">
              <input
                type="text"
                name="name"
                value={name}
                placeholder="Username"
                onChange={registerInputChange}
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                onChange={registerInputChange}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={registerInputChange}
              />
            </div>
            <div className="input-group avatar-group">
              <input
                type="file"
                name="avatar"
                accept="image/"
                className="file-input"
                onChange={registerInputChange}
              />
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="avatar"
              />
            </div>
            <button className="authBtn">{loading ? "Signing Up":"Sign Up"}</button>
            <p className="form-links">
              Already have an account? <Link to={'/login'}>Sign In here</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Register;
