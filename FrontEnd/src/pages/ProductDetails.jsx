import React from "react";
import "../pageStyles/ProductDetails.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from "../components/Rating";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  createReviews,
  getProductDetails,
  removeError,
  removeReviewSuccess,
} from "../features/product/productSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { addItemToCart, removemessage } from "../features/cart/cartSlice";

const ProductDetails = () => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState("")
  const { product, loading, error, reviewSuccess, reviewLoading } = useSelector(
    (state) => state.product
  );


  const {
    loading: cartLoading,
    error: cartError,
    cartItems,
    success,
    message,
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // getting product details
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
    return () => {
      dispatch(removeError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
    if (cartError) {
      toast.error(cartError, { position: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [error, dispatch, cartError]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error("Quantity can't be less than 1", {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(removeError());
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      toast.error("Cannot exceed available stock!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(removeError());
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const addToCart = () => {
    dispatch(addItemToCart({ id, quantity }));
  };

  // setting up the message
  useEffect(() => {
    if (success) {
      toast.success(message, { position: "bottom-right", autoClose: 3000 });
      dispatch(removemessage());
    }
  }, [success, dispatch, , message]);

// handling review submit 
  const handleReviewSubmit = (e) => {
  e.preventDefault();

  if (!rating) {
    toast.error("Please select the rating!!!", {
      position: "bottom-right",
      autoClose: 3000,
    });
    return;
  }

  if (!comment.trim()) {
    toast.error("Please write a comment!", {
      position: "bottom-right",
      autoClose: 3000,
    });
    return;
  }

  dispatch(createReviews({ rating, comment, productId: id }));
  setComment("");
  setRating(0);
};

  useEffect(() => {
    if (reviewSuccess) {
      toast.success("Review submit successfull", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
    dispatch(removeReviewSuccess());
  }, [dispatch, reviewSuccess]);


// Mounting first image
useEffect(() => {
  if(product && product.image && product.image.length > 1){
    setSelectedImage(product.image[0].url)
  }
 }, [product])


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Product Details" />
          <Navbar />
          <div className="product-details-container">
            <div className="product-detail-container">
              <div className="product-image-container">
                <img
                  src={selectedImage}
                  alt="product-title"
                  className="product-detail-image"
                />
                {product.image?.length > 1 && <div className="product-thumbnails">
                 {product.image.map((img,index)=>( <img key={index} src={img.url} alt={`Thumbnail ${index+1}`} className="thumbnail-image" onClick={()=>setSelectedImage(img.url)} />))}
                </div>}
              </div>


              <div className="product-info">
                <h2>{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">
                  <strong>Price : </strong>
                  {product.price} Rs
                </p>
                <div className="product-rating">
                  <Rating value={product.ratings} disabled={true} />
                  <span className="productCardSpan">
                    {product.numOfReviews}{" "}
                    {product.numOfReviews === 1 ? "Review" : "Reviews"}
                  </span>
                </div>

                <div className="stock-status">
                  <span
                    className={`${
                      product.stock >= 1 ? "in-stock" : "out-of-stock"
                    }`}
                  >
                    {product.stock >= 1
                      ? `In Stock ${product.stock} available`
                      : "Out of Stock"}
                  </span>
                </div>

                {product.stock >= 1 && (
                  <>
                    {" "}
                    <div className="quantity-controls">
                      <span className="quantity-label">Quantity:</span>
                      <button
                        className="quantity-button"
                        onClick={decreaseQuantity}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        readOnly
                        className="quantity-value"
                      />
                      <button
                        className="quantity-button"
                        onClick={increaseQuantity}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={addToCart}
                      disabled={cartLoading}
                    >
                      {cartLoading ? "Adding" : "Add to Cart"}
                    </button>
                  </>
                )}

                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <h3>Write Review</h3>
                  <Rating
                    value={rating}
                    disabled={false}
                    onRatingChange={handleRatingChange}
                  />
                  <textarea
                    placeholder="Write your review here"
                    className="review-input"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                  <button
                    className="submit-review-btn"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>

            <div className="reviews-container">
              <h3>Customer Reviews</h3>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="reviews-section">
                  {product.reviews.map((review) => (
                    <div className="review-item" key={review._id}>
                      <div className="review-header">
                        <Rating value={review.rating} disabled={true} />
                        <p className="review-comment">{review.comment}</p>
                        <p className="review-name">
                          <strong>By {review.name}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-reviews">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default ProductDetails;
