const Product = require("../models/productModel");
const HandleError = require("../utils/handleError");
const HandleAsyncError = require("../middleware/handleAsyncError");
const APIFunctionality = require("../utils/apiFunctionality");
const cloudinary = require("cloudinary").v2;
// http://localhost:3000/api/v1/products/68a98b93754cd1f443731b68?keyword=shirt

// Creating products
exports.createProducts = HandleAsyncError(async (req, res, next) => {
  let image = []
  if(typeof req.body.image === "string"){
    image.push(req.body.image)
  }else{
    image = req.body.image
  }

  const imageLinks = [];
  for(let i=0;i<image.length;i++){
    const result = await cloudinary.uploader.upload(image[i],{
      folder:"products"
    });
    imageLinks.push({
      public_id:result.public_id,
      url:result.secure_url
    })
  }
  req.body.image = imageLinks;
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products
exports.getAllProducts = HandleAsyncError(async (req, res, next) => {
  const resultsPerPage = 4;
  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  // Filtering query before pagination
  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();

  // calculate totalPages based on the filtered Count
  const totalPages = Math.ceil(productCount / resultsPerPage);
  const page = Number(req.query.page) || 1;

  if (page > totalPages && productCount > 0) {
    return next(new HandleError("This page doesn't exist", 404));
  }

  // Apply pagination
  apiFeatures.pagination(resultsPerPage);
  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
    totalPages,
    currentPage: page,
    resultsPerPage
  });
});

// Update product
exports.updateProducts = HandleAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
   if (!product) {
    return next(new HandleError("Product not found..!!", 404));
  }

  // updating the images in cloudinary and database
  let images = [];
  if(typeof req.body.image === "string"){
    images.push(req.body.image)
  }else if(Array.isArray(req.body.image)){
    images = req.body.image;
  }

  if(images.length > 0){
    // destroying old images
    for(let i = 0;i<product.image.length;i++){
      await cloudinary.uploader.destroy(product.image[i].public_id);
    }

    // updating the new images
    const imageLinks = [];
    for(let i = 0;i<images.length;i++){
      const result = await cloudinary.uploader.upload(images[i],{
        folder:"products"
      })
      imageLinks.push({
        public_id:result.public_id,
        url:result.secure_url
      })
    }
    req.body.image = imageLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
 
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete product
exports.deleteProducts = HandleAsyncError(async (req, res, next) => {
  const selectedproductId = req.params.id;
  const product = await Product.findByIdAndDelete(selectedproductId);
   if (!product) {
    return next(new HandleError("Product not found..!!", 404));
  }
  for(let i = 0;i<product.image.length;i++){
    await cloudinary.uploader.destroy(product.image[i].public_id)
  }
  res.status(200).json({
    success: true,
    message:"Product deleted successfully"
  });
});

// Accessing Single product
exports.getSingleProduct = HandleAsyncError(async (req, res, next) => {
  const selectedproductId = req.params.id;
  const product = await Product.findById(selectedproductId);
  if (!product) {
    return next(new HandleError("Product not found..!!", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// Create and update reviews
exports.createReviewForProducts = HandleAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const Newreview = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };


  // finding product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandleError("product not found", 401));
  }
  // checking for reviewExists or not
  const reviewExists = product.reviews.find(
    (review) =>
      review.user && review.user.toString() === req.user._id.toString()
  );
  if (reviewExists) {
    reviewExists.rating = Number(rating);
    reviewExists.comment = comment;
  } else {
    product.reviews.push(Newreview);
  }

  // number of reviews
  product.numOfReviews = product.reviews.length;

  // calculating average rating
  product.ratings =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((acc, item) => acc + item.rating, 0) /
        product.reviews.length;
  await product.save({ ValidateBeforeSave: false });
  res.status(200).json({
    success: true,
    product,
  });
});

// Getall products by admin
exports.getAllProductsByAdmin = HandleAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// Get Reviews of all products
exports.getProductReviews = HandleAsyncError(async (req, res) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new HandleError("product not found", 401));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete the review of specific product
exports.deleteProductReview = HandleAsyncError(async (req, res) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new HandleError("product not found", 404));
  }
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  // average rating 
  product.ratings =
    reviews.length === 0
      ? 0
      : reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

  // Number of rating
  product.numOfReviews = reviews.length;

  product.reviews = reviews;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message:"Product Review deleted",
  });
});
