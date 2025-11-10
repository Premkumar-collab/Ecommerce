import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateRole.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUserDetail, removeError, removeSuccess, updateUserRoleByAdmin } from "../features/admin/adminSlice";
import {toast} from 'react-toastify'
const UpdateRole = () => {
  const {id} = useParams();
  const {user,loading,error,success} = useSelector(state=>state.admin);
  const dispatch = useDispatch();
  const [formData,setFormData] = useState({
    name:"",
    email:"",
    role:""
  })
  const {name,email,role} = formData;
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(getSingleUserDetail(id))
  },[dispatch,id])

  useEffect(() => {
    if(user){
      setFormData({
        name:user.name || "",
        email: user.email || "",
        role:user.role || ""
      })
    }
  }, [user])
  
const handleChange = (e)=>{
  setFormData({...formData,[e.target.name]:e.target.value})
}

const handleFormSubmit = (e)=>{
  e.preventDefault();
  dispatch(updateUserRoleByAdmin({id,role}))
}

  // success
  useEffect(() => {
    if (success) {
      toast.success("User role updated Successfully", {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate("/admin/users")
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
    {
      loading ? (<Loader/>) : (<>
      <PageTitle title={"Update User Role"} />
      <Navbar />
      <div className="page-wrapper">
        <div className="update-user-role-container">
          <h1>Update User Role</h1>
          <form className="update-user-role-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" readOnly value={name}/>
            </div>
            <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" readOnly value={email}/>
            </div>

            <div className="form-group">
            <label htmlFor="role">Role</label>
            <select name="role" id="role" required value={role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            </div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Updating Role..." : "Update Role"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>)
    }
    </>
  );
};

export default UpdateRole;
