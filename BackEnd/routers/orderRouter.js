const express = require('express')
const orderRouter = express.Router()

// Local modules
const orderController = require('../controller/orderController')
const {verifyUserAuth,roleBasedAccess} = require('../middleware/userAuth')

// Creating new orders
orderRouter.post('/new/order',verifyUserAuth,orderController.createNewOrder)


// Getting single order for user
orderRouter.get('/order/:id',verifyUserAuth,orderController.getSingleOrder)

// Getting particular user orders
orderRouter.get('/user/orders',verifyUserAuth,orderController.allMyOrders)

// Getting all orders by admin
orderRouter.get('/admin/orders',verifyUserAuth,roleBasedAccess("admin"),orderController.getAllOrders)

// updating status of the order by admin
orderRouter.put('/admin/order/:id',verifyUserAuth,roleBasedAccess("admin"),orderController.updateOrderStatus)

// Delete order after it is delivered
orderRouter.delete('/admin/order/:id',verifyUserAuth,roleBasedAccess("admin"),orderController.deleteOrder);

module.exports = orderRouter;