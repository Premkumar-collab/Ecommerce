import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../AdminStyles/UpdateProduct.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../features/product/productSlice";
import { updateProduct } from "../features/admin/adminSlice";
import { removeSuccess, removeError } from "../features/admin/adminSlice";
import { toast } from "react-toastify";
const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [oldImage, setOldImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const { id } = useParams();
  const { product } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { success, error, loading } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const categories = [
    "Laptops",
    "Mobile",
    "Glass",
    "Kitchen",
    "Sports",
    "Clothes",
  ];

  // getting single product details
  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [id, dispatch]);

  // pre-filling
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setStock(product.stock || "");
      setOldImage(Array.isArray(product.image) ? product.image : []);
    }
  }, [product]);

  const handleUpdateImage = (e) => {
    const files = Array.from(e.target.files);
    setImage([]);
    setImagePreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage((old) => [...old, reader.result]);
          setImagePreview((old) => [...old, reader.result]); // preview only
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    image.forEach((img) => {
      myForm.append("image", img);
    });
    dispatch(updateProduct({ id, productData: myForm }));
    
  };

  // success
  useEffect(() => {
    if (success) {
      toast.success("Product update successful", {
        position: "bottom-right",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate('/admin/products')
    }
  }, [success, dispatch]);

  // error
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [error, dispatch]);

  return (
    <>
      <PageTitle title={"Update Product"} />
      <Navbar />
      <div className="update-product-wrapper">
        <h1 className="update-product-title">Update Product</h1>
        <form
          className="update-product-form"
          encType="multipart/form-data"
          onSubmit={handleUpdateSubmit}
        >
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            className="update-product-input"
            required
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="price">Product Price</label>
          <input
            type="number"
            className="update-product-input"
            required
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label htmlFor="description">Product Description</label>
          <textarea
            type="text"
            className="update-product-textarea"
            required
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="category">Product Category</label>
          <select
            name="category"
            id="category"
            className="update-product-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a Category</option>
            {categories.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor="stock">Product Stock</label>
          <input
            type="number"
            className="update-product-input"
            required
            id="stock"
            name="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <label htmlFor="image">Product Images</label>
          <div className="update-product-file-wrapper">
            <input
              type="file"
              className="update-product-file-input"
              name="image"
              accept="image/*"
              multiple
              onChange={handleUpdateImage}
            />
          </div>

          <div className="update-product-preview-wrapper">
            {imagePreview.map((img, index) => (
              <img
                src={img}
                alt="Product Preview"
                className="update-product-preview-image"
                key={index}
              />
            ))}
          </div>
          <div className="update-product-old-images-wrapper">
            {oldImage.map((img, index) => (
              <img
                src={img.url}
                alt="Old Product Preview"
                className="update-product-old-image"
                key={index}
              />
            ))}
          </div>

          <button className="update-product-submit-btn">
            {loading ? "Updating" : "Update"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UpdateProduct;
