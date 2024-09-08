import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../Components/Breadcrum/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import ReletedProducts from "../Components/RelatedProduct/ReletedProducts";
import "./CSS/Product.css";

const Product = () => {
  // const { all_product } = useContext(ShopContext);
  // const { productId } = useParams();
  // const product = all_product.find((e) => e.id === Number(productId));

  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (all_product.length > 0) {
      const foundProduct = all_product.find((e) => e.id === Number(productId));
      setProduct(foundProduct);
    }
  }, [all_product, productId]);

  if (!product) {
    return <div>Loading...</div>; // Show loading state if product is not available
  }

  return (
    <div className="product">
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <ReletedProducts />
    </div>
  );
};

export default Product;
