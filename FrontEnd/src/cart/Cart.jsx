import React from "react";
import "../CartStyles/Cart.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartProductItems from "../cart/CartProductItems";
import { useSelector } from "react-redux";
import {Link, useNavigate} from 'react-router-dom'

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const subTotal = cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0);
  const tax = subTotal*(18/100);
  const Shipping = subTotal > 500 ? 0 : 50;
  const totalPrice = subTotal + tax + Shipping;
  const navigate = useNavigate();
  const checkOutHandler= ()=>{
      navigate("/login?redirect=/shipping")
  }
  return (
    <>
      <PageTitle title={"Your Cart"} />
      <Navbar />
      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <p className="empty-cart-message">Your cart is empty</p>
          <Link to="/products" className="viewProducts">
            View Products
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-page">
            <div className="cart-items">
              <div className="cart-items-heading">Your Cart</div>
              <div className="cart-table">
                <div className="cart-table-header">
                  <div className="header-product">Product</div>
                  <div className="header-product">Quantity</div>
                  <div className="header-total item-total-heading">
                    Item Total
                  </div>
                  <div className="header-total item-total-heading">Actions</div>
                </div>

                {/* Cart items */}
                {cartItems &&
                  cartItems.map((cartitem) => (
                    <CartProductItems cartitem={cartitem} key={cartitem.name} />
                  ))}
              </div>
            </div>

            {/* Price summary */}
            <div className="price-summary">
              <h3 className="price-summary-heading">Price Summary</h3>
              <div className="summary-item">
                <p className="summary-label">Subtotal :</p>
                <p className="summary-value">{subTotal}/-</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Tax (18%) :</p>
                <p className="summary-value">{tax}/-</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Shipping :</p>
                <p className="summary-value">{Shipping}/-</p>
              </div>
              <div className="summary-total">
                <p className="summary-label">Total :</p>
                <p className="summary-value">{totalPrice}/-</p>
              </div>

              <button className="checkout-btn" onClick={checkOutHandler}>Proceed to checkout</button>
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
};

export default Cart;
