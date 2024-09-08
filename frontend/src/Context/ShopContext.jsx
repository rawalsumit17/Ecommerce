import React, { createContext } from "react";
import { useState, useEffect } from "react";

export const ShopContext = createContext(null);
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopcontextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((response) => response.json())
      .then((data) => setAll_Product(data));

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/getcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: "",
      })
        .then((response) => response.json())
        .then((data) => setCartItems(data));
    }
  }, []);

  // const addToCart = async (itemId) => {
  //   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  //   if (localStorage.getItem("auth-token")) {
  //     await fetch("http://localhost:4000/addtoCart", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/form-data",
  //         "auth-token": `${localStorage.getItem("auth-token")}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ itemId: itemId }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => console.log(data));
  //   }
  // };

  const addToCart = async (itemId) => {
    const updatedCart = {
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1,
    };
    setCartItems(updatedCart); // Immediate UI update

    if (localStorage.getItem("auth-token")) {
      try {
        await fetch("http://localhost:4000/addtoCart", {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "auth-token": `${localStorage.getItem("auth-token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: itemId }),
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
        // Optionally revert the local state change or display an error message
      }
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      }).then((response) => response.json());
      // .then((data) => console.log(data));
    }
  };
  // const getTotalCartAmount = () => {
  //   let totalAmount = 0;
  //   for (const item in cartItems) {
  //     if (cartItems[item] > 0) {
  //       let itemInfo = all_product.find(
  //         (product) => product.id === Number(item)
  //       );
  //       totalAmount += itemInfo.new_price * cartItems[item];
  //     }
  //   }
  //   return totalAmount;
  // };

  const getTotalCartAmount = () => {
    // console.log("Cart Items:", cartItems);
    // console.log("All Products:", all_product);
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        // console.log("Item Info:", itemInfo);
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        } else {
          // console.warn(`Product with ID ${item} not found.`);
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default ShopcontextProvider;
