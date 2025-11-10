import React, { useEffect } from "react";
import "../UserStyles/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="profile-container">
          <PageTitle title={`${user.name} Profile`} />
          <div className="profile-image">
            <h1 className="profile-heading">My Profile</h1>
            <img
              src={
                user.avatar.url ? user.avatar.url : ".images/profile-logo.jpg"
              }
              alt="User Profile"
              className="profile-image"
            />
            <Link to="/profile/update">Edit Profile</Link>
          </div>
          <div className="profile-details">
            <div className="profile-detail">
              <p>{user.name}</p>
            </div>
            <div className="profile-detail">
              <h2>Email:</h2>
              <p>{user.email}</p>
            </div>
            <div className="profile-detail">
              <h2>Joined On:</h2>
              <p>
                {user.createdAt
                  ? user.createdAt.toString().substring(0, 10)
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* profile buttons */}
          <div className="profile-buttons">
            <Link to="/user/orders">My Orders</Link>
            <Link to="/password/update">Change Password</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
