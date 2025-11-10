import React, { useEffect, useState } from "react";
import "../pageStyles/Products.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { getProduct, removeError } from "../features/product/productSlice";
import Product from "../components/Product";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import NoProducts from "../components/NoProducts";
import Pagination from "../components/Pagination";
const Products = () => {
  const { products, loading, error } =
    useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const pageFromURL = parseInt(searchParams.get("page"), 10) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const navigate = useNavigate();

  // array of categories
  const categories = [
    "Laptops",
    "Mobile",
    "Glass",
    "Kitchen",
    "Sports",
    "Clothes",
  ];

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage ,category}));
  }, [dispatch, keyword, currentPage,category]);

  // dispatching Errors
  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, error]);

  // handle page change
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);

      const newSearchParams = new URLSearchParams(location.search);
      if (page === 1) {
        newSearchParams.delete("page");
      } else {
        newSearchParams.set("page", page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  // handle category change
  const handleCategoryChange = (category) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("category", category);
    newSearchParams.delete("page");
    navigate(`?${newSearchParams.toString()}`);
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="All Products" />
          <Navbar />
          <div className="products-layout">
            <div className="filter-section">
              <h3 className="filter-heading">CATEGORIES</h3>

              {/* render categories */}
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </li>
              ))}
              
            </div>
            <div className="products-section">
              {products.length > 0 ? (
                <div className="products-product-container">
                  {products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProducts keyword={keyword} />
              )}

              <Pagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Products;
