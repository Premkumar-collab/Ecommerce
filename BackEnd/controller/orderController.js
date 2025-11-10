const Product = require("../models/productModel");
const HandleError = require("../utils/handleError");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const HandleAsyncError = require("../middleware/handleAsyncError");

// Create order
exports.createNewOrder = HandleAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// Get single order by admin and user
exports.getSingleOrder = HandleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new HandleError("no order found", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// Get all my orders by users
exports.allMyOrders = HandleAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  if (!orders) {
    return next(new HandleError("no orders found", 404));
  }
  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all  orders by admin
exports.getAllOrders = HandleAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders || orders.length === 0) {
    return next(new HandleError("no orders found", 404));
  }
  const totalAmount = orders.reduce((acc, item) => acc + item.totalPrice, 0);
  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

exports.updateOrderStatus = HandleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("No order found", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new HandleError("This item has been delivered", 404));
  }

  await Promise.all(
    order.orderItems.map((item) => updateQuantity(item.product, item.quantity))
  );
  order.orderStatus = req.body.status;
  if (order.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});

async function updateQuantity(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found!!")
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete order by admin after it is delivered
exports.deleteOrder = HandleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("no order found", 404));
  }
  if (order.orderStatus !== "Delivered") {
    return next(
      new HandleError("This order is under processing it can't be deleted", 404)
    );
  }
  await order.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    message:"Order Deleted successfully"
  });
});
