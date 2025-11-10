const handleAsyncError = require("../middleware/handleAsyncError");
const instance = require("../config/razorpay");
const crypto = require("crypto");

exports.processPayment = handleAsyncError(async (req, res, next) => {
  const options = {
    amount: Number(req.body.amount * 100), // recieving amount in paise
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  res.status(200).json({
    success: true,
    order,
  });
});

// Send api key
exports.sendApiKey = handleAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZOR_PAY_API_KEY,
  });
});

// payment vefication
exports.paymentVerification = handleAsyncError(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZOR_PAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");
  console.log("ExpectedSignature:", expectedSignature);
  console.log("Razon pay signature:", razorpay_signature);
  const isAuthetic = expectedSignature === razorpay_signature;
  if (isAuthetic) {
    return res.status(200).json({
      success: true,
      message: "Payment verified Successful",
      reference: razorpay_payment_id,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Payment verified failed",
    });
  }
});
