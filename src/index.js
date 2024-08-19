const express = require("express");
const app = express();
const userController = require("./controllers/user.controller")
const productController = require("./controllers/product.controller");

app.use(express.json());
app.use("/users" , userController)
app.use("/products",productController)


module.exports = app

