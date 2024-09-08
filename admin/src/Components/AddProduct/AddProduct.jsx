import React, { useRef, useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const imageRef = useRef(null);
  const nameRef = useRef("");
  const oldPriceRef = useRef("");
  const newPriceRef = useRef("");
  const categoryRef = useRef("");

  const imageHandler = (e) => {
    const file = e.target.files[0];
    imageRef.current = file;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      console.log(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!nameRef.current.value.trim()) {
      errors.name = "is Required*";
    }
    if (!oldPriceRef.current.value.trim()) {
      errors.oldPrice = "is Required*";
    }
    if (!newPriceRef.current.value.trim()) {
      errors.newPrice = "is Required*";
    }
    if (!categoryRef.current.value.trim()) {
      errors.category = "Please Select Category*";
    }
    if (imagePreview === null) {
      errors.image = "Please Select Image*";
    }

    return errors;
  };

  const add_product = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let imageUrl = "";
    if (imageRef.current) {
      const formData = new FormData();
      formData.append("product", imageRef.current);
      await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) {
            imageUrl = data.image_url;
          } else {
            throw new Error("Image upload failed");
          }
        });
    }

    const productDetails = {
      name: nameRef.current.value,
      image: imageUrl,
      category: categoryRef.current.value,
      new_price: newPriceRef.current.value,
      old_price: oldPriceRef.current.value,
    };

    await fetch("http://localhost:4000/addproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productDetails),
    })
      .then((resp) => resp.json())
      .then((data) => {
        data.success ? alert(`Product ${data.name} Added`) : alert("failed");
      });

    console.log(productDetails);
    setErrors({});
    if (nameRef.current) nameRef.current.value = "";
    if (oldPriceRef.current) oldPriceRef.current.value = "";
    if (newPriceRef.current) newPriceRef.current.value = "";
    if (categoryRef.current) categoryRef.current.value = "";

    // Reset image preview
    setImagePreview(null);

    // Clear the image file reference
    imageRef.current = null;
  };

  return (
    <div className="add-product">
      <p className="addproduct-title">ADD YOUR PRODUCT HERE</p>
      <div className="addproduct-itemfield">
        <p>
          Product Title / Name{" "}
          {errors.name && <span className="error-message">{errors.name}</span>}
        </p>{" "}
        <input
          ref={nameRef}
          // onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Product Name & title"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>
            price{" "}
            {errors.oldPrice && (
              <span className="error-message">{errors.oldPrice}</span>
            )}
          </p>
          <input
            ref={oldPriceRef}
            type="number"
            name="old_price"
            placeholder="Price"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>
            Offer Price{" "}
            {errors.newPrice && (
              <span className="error-message">{errors.newPrice}</span>
            )}
          </p>{" "}
          <input
            ref={newPriceRef}
            type="number"
            name="new_price"
            placeholder="Offer Price"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>
          Product Category{" "}
          {errors.category && (
            <span className="error-message">{errors.category}</span>
          )}
        </p>
        <select
          ref={categoryRef}
          name="Category"
          className="add-product-selector"
        >
          <option value="">Select Category</option>
          <option value="women">Women</option>
          <option value="Men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield img-field">
        <label htmlFor="file-input">
          <img
            className="
          addproduct-thumnail-img"
            src={imagePreview || upload_area}
            alt=""
          />
        </label>
        {errors.image && <span className="error-message">{errors.image}</span>}
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={add_product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
