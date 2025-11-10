import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {addItemToCart, removeError,removeFromCart,removemessage} from '../features/cart/cartSlice'
import {toast} from 'react-toastify'
const CartProductItems = ({ cartitem }) => {
  const {cartItems,success,error,loading,message} = useSelector(state=>state.cart)
  const [quantity, setQuantity] = useState(cartitem.quantity);
  const dispatch = useDispatch();

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
      if (cartitem.stock <= quantity) {
        toast.error("Cannot exceed available stock!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        dispatch(removeError());
        return;
      }
      setQuantity((prev) => prev + 1);
    };

    const handleUpdate = ()=>{
      if(loading) return;
      if(quantity!==cartitem.quantity){
        dispatch(addItemToCart({id:cartitem.productId,quantity}))
      }
    }

    // update messge 
      useEffect(() => {
        if (success) {
          toast.success(message, { position: "bottom-right", autoClose: 3000 ,toastId:"cart-update" });
          dispatch(removemessage());
        }
      }, [success, dispatch, , message]);

    const removeItem = ()=>{
      if(loading) return;
      dispatch(removeFromCart(cartitem.productId))
       toast.success("Item removed from cart successfully", { position: "bottom-right", autoClose: 3000 });
          dispatch(removemessage());
    }
  return (
    <div className="cart-item">
      <div className="item-info">
        <img src={cartitem.image} alt="Product Image" className="item-image" />
        <div className="item-details">
          <h3 className="item-name">{cartitem.name}</h3>
          <p className="item-price">
            <strong>Price :</strong> {cartitem.price.toFixed(2)}/-
          </p>
          <p className="item-quantity">
            <strong>Quantity :</strong>
            {cartitem.quantity}
          </p>
        </div>
      </div>

      <div className="quantity-controls">
        <button
          className="quantity-button decrease-btn"
          onClick={decreaseQuantity}
           disabled={loading}
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          readOnly
          className="quantity-input"
          min={"1"}
        />
        <button
          className="increase-btn quantity-button"
          onClick={increaseQuantity}
          disabled={loading}
        >
          +
        </button>
      </div>

      <div className="item-total">
        <span className="item-total-price">
          {(cartitem.price *cartitem.quantity).toFixed(2)}/-
        </span>
      </div>

      <div className="item-actions">
        <button className="update-item-btn" onClick={handleUpdate} disabled={loading || cartitem.quantity === quantity}>Update</button>
        <button className="remove-item-btn" disabled={loading} onClick={removeItem}>Remove</button>
      </div>
    </div>
  );
};

export default CartProductItems;
