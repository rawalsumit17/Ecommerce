require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cors());

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) =>
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    ),
});

const upload = multer({ storage });

// Image upload endpoint
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Product schema
const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
  })
);

// Creating Api for Add Product
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Product Added");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating Api for Remove Product
app.post("/removeproduct", async (req, res) => {
  const removedProduct = await Product.findOneAndDelete({ id: req.body.id });
  console.log("Product Removed");
  res.json({
    success: true,
    name: removedProduct.name,
  });
});

// Creating Api for getting All Products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("all Products Fetched");
  res.send(products);
});

// User schema
const Users = mongoose.model(
  "Users",
  new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object, default: {} },
    date: { type: Date, default: Date.now },
  })
);

//Creating EndPoint For Registering User
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      error: "Existing user found with same email address",
    });
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: {},
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

//Creating EndPoint For User Login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "Wrong Password" });
    }
  } else {
    res.json({ success: false, error: "Wrong Email id" });
  }
});

//creating endpoint for newcollections
app.get("/newcollection", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("new collection fatched");
  res.send(newcollection);
});

// creating endpoint for popular in women section
app.get("/popularInWomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_women_Products = products.slice(1).slice(-4);
  console.log("popular in women fatcched");
  res.send(popular_women_Products);
});

//creating middleware to  fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }
  }
};

//creating endpoinnt for adding products in cartdata
app.post("/addtoCart", fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    // Validate the input
    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }

    // Fetch user data
    let userData = await Users.findOne({ _id: userId });

    // Check if the user exists
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Initialize the item count if it doesn't exist
    if (!userData.cartData[itemId]) {
      userData.cartData[itemId] = 0;
    }

    // Increment the quantity
    userData.cartData[itemId] = Number(userData.cartData[itemId]) + 1;

    // Update the user's cart in the database
    await Users.findOneAndUpdate(
      { _id: userId },
      { cartData: userData.cartData },
      { new: true } // Return the updated document
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//creating endpoint to remove product from cartData
// app.post("/removefromcart", fetchUser, async (req, res) => {
//   console.log("our removeing id product", req.body.itemId);
//   let userData = await Users.findOne({ _id: req.user.id });
//   if (userData.cartData[req.body.itemId] > 0) {
//     userData.cartData[req.body.itemId] -= 1;
//     console.log("it is working", userData.cartData[req.body.itemId]);
//     await Users.findOneAndUpdate(
//       { _id: req.user.id },
//       { cartdata: userData.cartData[req.body.itemId] }
//     );
//     res.json({ success: true });
//   }
// });
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    console.log("Removing product ID:", req.body.itemId);

    // Fetch the user data
    let userData = await Users.findOne({ _id: req.user.id });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the item exists in the cart and has quantity greater than 0
    if (
      userData.cartData[req.body.itemId] &&
      userData.cartData[req.body.itemId] > 0
    ) {
      // Decrease the quantity
      userData.cartData[req.body.itemId] -= 1;

      // Remove the item from cartData if its quantity is 0
      if (userData.cartData[req.body.itemId] === 0) {
        delete userData.cartData[req.body.itemId];
      }

      console.log("Updated cartData:", userData.cartData);

      // Update the user's cart in the database
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        { cartData: userData.cartData }
      );

      res.json({ success: true });
    } else {
      res.status(400).json({
        success: false,
        message: "Item not found in cart or quantity is zero",
      });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//creating endpoint to get cartData
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("Get cart");
  let userData = await Users.findOne({ _id: req.user.id });
  // console.log(userData);
  res.json(userData.cartData);
});

// Start server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error : " + error);
  }
});
