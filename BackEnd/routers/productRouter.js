const express = require("express");
const productRouter = express.Router();


// Local modules
const productController = require('../controller/productController')
const {verifyUserAuth,roleBasedAccess} = require('../middleware/userAuth')

// main page
productRouter.get('/products',productController.getAllProducts);
// Get reviews of all products
productRouter.get('/admin/reviews',productController.getProductReviews)
// Get all products by admin
productRouter.get('/admin/products',verifyUserAuth,roleBasedAccess("admin"),productController.getAllProductsByAdmin);
// admin create products
productRouter.post('/admin/products/create',verifyUserAuth,roleBasedAccess("admin"),productController.createProducts);
// admin  update product
productRouter.put('/admin/product/update/:id',verifyUserAuth,roleBasedAccess("admin"),productController.updateProducts);
// admin  delete product
productRouter.delete('/admin/product/delete/:id',verifyUserAuth,roleBasedAccess("admin"),productController.deleteProducts);

// Get single product
productRouter.get('/product/:id',productController.getSingleProduct)

// create and update review
productRouter.put('/products/review',verifyUserAuth,productController.createReviewForProducts)

productRouter.delete('/admin/reviews',verifyUserAuth,productController.deleteProductReview)


module.exports = productRouter;
