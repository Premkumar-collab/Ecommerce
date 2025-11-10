const HandleAsyncError = require("../middleware/handleAsyncError");
const User = require("../models/userModel");
const HandleError = require("../utils/handleError");
const { sendToken } = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

// Register user
exports.registerUser = HandleAsyncError(async (req, res, next) => {
  const { name, email, password, role, avatar } = req.body;
  const myCloud = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    role,
  });

  sendToken(user, 201, res);
});

// Login user
exports.getLoginUser = HandleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HandleError("Email or password is can't be empty", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new HandleError("Invalid Email or password", 401));
  }

  const ispasswordValid = await user.verifyPassword(password);
  if (!ispasswordValid) {
    return next(new HandleError("Invalid Email or password", 401));
  }
  sendToken(user, 200, res);
});

// Logout user

exports.getLogout = HandleAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Successfully Logged Out",
  });
});

// Forgotten Password
exports.requestResetPassword = HandleAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new HandleError("User not found..!. Invalid emial", 400));
  }
  let resetToken;
  try {
    resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    return next(
      new HandleError(
        "Could not generate token please try again later...!!!",
        500
      )
    );
  }

  // creating a separate link to reset password

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

  const message = `Use the following link to reset your password : ${resetPasswordUrl} .\n\n This link will expire in 30 minutes.\n\n If you didn't request a password reset, please ignore this message.`;

  try {
    // Send email
    await sendEmail({
      email: user.email,
      subject: "Request to change password.",
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `email is sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new HandleError("Email couldn't be sent , please try again later", 500)
    );
  }
});

// Reset Password
exports.resetPassword = HandleAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new HandleError(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }

  // now changing the password
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return next(new HandleError("Password doesn't match", 400));
  }
  user.password = newPassword;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// Get userDetails
exports.getUserDetails = HandleAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new HandleError("User not found..!", 401));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update password[old password to new password]
exports.updatePassword = HandleAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // find user
  const user = await User.findById(req.user.id).select("+password");
  const matchPassword = await user.verifyPassword(oldPassword);
  if (!matchPassword) {
    return next(new HandleError("Old password is incorrect", 400));
  }
  if (newPassword !== confirmPassword) {
    return next(new HandleError("Password doen't match", 400));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// update user Details
exports.updateUserDetails = HandleAsyncError(async (req, res, next) => {
  const { name, email, avatar } = req.body;
  const updateDetails = {
    name,
    email,
  };
  if (avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar?.public_id;
    await cloudinary.uploader.destroy(imageId);
    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    updateDetails.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateDetails, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// Get all users list by admin
exports.getAllUsersList = HandleAsyncError(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new HandleError("Users list not found...!", 400));
  }
  res.status(200).json({
    success: true,
    users,
  });
});

// Get singleDetail by admin
exports.getSingleUserDetail = HandleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new HandleError("User detail not found...!!!", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Update role by admin
exports.updateUserRoleByAdmin = HandleAsyncError(async (req, res, next) => {
  const { role } = req.body;
  const updateRole = {
    role,
  };
  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateRole, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    updatedUser,
  });
});

// Delete a particular User by admin
exports.deleteUserByAdmin = HandleAsyncError(async (req, res, next) => {
  const deletedUser = await User.findById(req.params.id);
  if (!deletedUser) {
    return next(new HandleError("User not found.", 400));
  }
  const imageId = deletedUser.avatar?.public_id;
  await cloudinary.uploader.destroy(imageId);
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User deleted Successfully",
  });
});
