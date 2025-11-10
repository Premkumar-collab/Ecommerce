import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import "../AdminStyles/ReviewsList.css";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductsByAdmin,
  fetchProductReviews,
  deleteProductReview,
  removeSuccess,
  removeError,
  clearMessage,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ReviewsList = () => {
  const { products, loading, error, reviews, success, message } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();
  const [selected, setSelected] = useState();
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(getAllProductsByAdmin());
  }, [dispatch]);

  const handleReview = (id) => {
    setSelected(id);
    dispatch(fetchProductReviews(id));
  };

  const handleDeleteReview = (productId, reviewId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete review?"
    );
    if (isConfirmed) {
      dispatch(deleteProductReview({ productId, reviewId }));
    }
  };

  // success
  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      dispatch(clearMessage())
      navigate("/admin/products")
    }
  }, [success,message, dispatch]);

  // error
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [error, dispatch]);

  if (!products || products.length === 0) {
    return (
      <div className="reviews-list-container">
        <h1 className="reviews-list-title">Admin Reviews</h1>
        <p>No Product Found</p>
      </div>
    );
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={"All Reviews"} />
          <Navbar />
          <div className="reviews-list-container">
            <h1 className="reviews-list-title">All Products</h1>
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Product Name</th>
                  <th>Product Image</th>
                  <th>Numbers of Reviews</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>
                      <img
                        src={product.image[0].url}
                        alt="mobile"
                        className="product-image"
                      />
                    </td>
                    <td>{product.numOfReviews}</td>
                    <td>
                      {product.numOfReviews > 0 && (
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleReview(product._id)}
                        >
                          View Reviews
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selected && reviews && reviews.length > 0 && (
              <div className="reviews-details">
                <h2>Reviews for Products</h2>
                <table className="reviews-table">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Reviewer Name</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review, index) => (
                      <tr key={review._id}>
                        <td>{index + 1}</td>
                        <td>{review.name}</td>
                        <td>{review.rating}</td>
                        <td>{review.comment}</td>
                        <td>
                          <button
                            className="action-btn delete-btn"
                            onClick={() =>
                              handleDeleteReview(selected, review._id)
                            }
                            disabled={loading}
                          >
                           {loading ? (<Loader/>) : (<Delete />)}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default ReviewsList;
