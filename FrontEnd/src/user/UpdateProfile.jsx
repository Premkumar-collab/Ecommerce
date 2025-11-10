import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeError, removeSuccess, updateProfile } from "../features/user/userSlice";


const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "../images/profile-logo.jpg"
  );

  const { user, error, message, success, loading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImageUpdate = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.onerror = (error) => {
      toast.error("Error in reading file");
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const updateSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);
    dispatch(updateProfile(myForm));
  };

  // Showing error using toast
  useEffect(() => {
    if (error) {
      toast.error(error, { positon: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, error]);


  useEffect(() => {
    if (success) {
      toast.success(message, { positon: "bottom-right", autoClose: 3000 });
      dispatch(removeSuccess());
      navigate('/profile')
    }
  }, [dispatch, success]);

  // pre-render of the user details
  useEffect(() => {
    if(user){
      setName(user.name)
      setEmail(user.email)
      setAvatarPreview(user.avatar?.url)
    }
  }, [user])
  


  return (
    <>
      <Navbar />
      <div className="container update-container">
        <div className="form-content">
          <form
            className="form"
            encType="multipart/form-data"
            onSubmit={updateSubmit}
          >
            <h2>Update Profile</h2>
            <div className="input-group avatar-group">
              <input
                type="file"
                accept="image/"
                name="avatar"
                className="file-input"
                onChange={profileImageUpdate}
              />
              <img src={avatarPreview} alt="User Profile" className="avatar" />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button className="authBtn">Update</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateProfile;
