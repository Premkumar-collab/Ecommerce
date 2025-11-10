const express = require('express')
const paymentRouter = express.Router();

// local modules
const paymentController = require('../controller/paymentController')
const {verifyUserAuth}  = require('../middleware/userAuth')

paymentRouter.post("/process/payment",verifyUserAuth,paymentController.processPayment)

paymentRouter.get("/getKey",verifyUserAuth,paymentController.sendApiKey)
paymentRouter.post("/paymentVerification",paymentController.paymentVerification)


module.exports = paymentRouter;