const express = require("express");
const userRouter = express.Router();

// Local modules
const UserController = require("../controller/userController")
const {verifyUserAuth, roleBasedAccess} = require('../middleware/userAuth')

userRouter.post('/register',UserController.registerUser);
userRouter.post('/login',UserController.getLoginUser)
userRouter.post('/logout',UserController.getLogout)
userRouter.post('/password/forget',UserController.requestResetPassword)
userRouter.post('/reset/:token',UserController.resetPassword)
userRouter.get('/profile',verifyUserAuth,UserController.getUserDetails)
userRouter.put('/password/update',verifyUserAuth,UserController.updatePassword)
userRouter.put('/profile/update',verifyUserAuth,UserController.updateUserDetails)

userRouter.get("/admin/users",verifyUserAuth,roleBasedAccess("admin"),UserController.getAllUsersList)
userRouter.get("/admin/user/:id",verifyUserAuth,roleBasedAccess("admin"),UserController.getSingleUserDetail)
userRouter.put("/admin/user/:id",verifyUserAuth,roleBasedAccess("admin"),UserController.updateUserRoleByAdmin)
userRouter.delete("/admin/user/:id",verifyUserAuth,roleBasedAccess("admin"),UserController.deleteUserByAdmin)

module.exports = userRouter;