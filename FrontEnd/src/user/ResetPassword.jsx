import React from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useState ,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { removeError, removeSuccess, resetPassword } from '../features/user/userSlice'
const ResetPassword = () => {
  const [newPassword,setNewPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const {loading,error,success} = useSelector(state=>state.user)
  const dispatch = useDispatch();
  const {token} = useParams();
  const navigate = useNavigate();
  const resetPasswordSubmit = (e)=>{
    e.preventDefault();
    const data = {
      newPassword,
      confirmPassword
    }
    dispatch(resetPassword({token:token,userData:data}))
  }

    // Showing error using toast
    useEffect(() => {
      if (error) {
        toast.error(error, { positon: "bottom-right", autoClose: 3000 });
        dispatch(removeError());
      }
    }, [dispatch, error]);
  

    // After update successful
    useEffect(() => {
      if (success) {
        toast.success("New password updated successfully", {
          positon: "bottom-right",
          autoClose: 3000,
        });
        dispatch(removeSuccess());
        navigate("/login");
      }
    }, [dispatch, success]);

  return (
    <>
     <PageTitle title={"Reset Password"} />
          <Navbar />
          <div className="container update-container">
            <div className="form-content">
              <form className="form" onSubmit={resetPasswordSubmit}>
                <h2>Reset Password</h2>
                <div className="input-group">
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button className="authBtn">
                  {loading ? "Changing" : "Change"}
                </button>
              </form>
            </div>
          </div>
          <Footer />
    </>
  )
}

export default ResetPassword
