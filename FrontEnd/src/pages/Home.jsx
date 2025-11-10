import React, { useEffect } from "react";
import "../pageStyles/Home.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Product from "../components/Product";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeError } from "../features/product/productSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Home = () => {
  const { products, loading, error, productCount } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();

  // Fetching products from backend
  useEffect(() => {
    dispatch(getProduct({keyword:""}));
  }, [dispatch]);

  // Showing error using toast
  useEffect(()=>{
    if(error){
      toast.error(error.message,{position:"bottom-right",autoClose:3000});
      dispatch(removeError());
    }
  },[dispatch,error])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={"Home My website"} />
          <Navbar />
          <ImageSlider />
          <div className="home-container">
            <h2 className="home-heading">Trending Now</h2>
            <div className="home-product-container">
              {products.map((product, index) => (
                <Product product={product} key={index} />
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
