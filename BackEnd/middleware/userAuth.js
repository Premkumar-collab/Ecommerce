const HandleError = require("../utils/handleError");
const handleAsyncError = require("./handleAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new HandleError(
        "Authentication is missing!!. Please login to access resource",
        401
      )
    );
  }
  const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decodeData.id);
  next();
});


exports.roleBasedAccess = (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new HandleError(`Role - ${req.user.role} is not allowed to access the resource`,403))
    }
    next();
  }
}