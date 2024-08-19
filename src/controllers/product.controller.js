const express = require("express");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { formateErrors } = require("../utils/validation");

router.post(
  "/",
  body("name") // we will passing as middleware
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Must be atleast 3 characters"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .custom((value) => {
      // we can also add custom validation for value comex from any filed
      if (value <= 0) {
        throw new Error("Price must be greated than zero");
      } else {
        return true;
      }
    }),
  body("user_id") // checking that user that created this product has exist in database or not means if user nit exist in database so how wrong user can create the product
    .notEmpty()
    .withMessage("user id is required")
    .custom(async (value) => {
      try {
        const user = await User.findById(value).lean().exec();
        if (!user) {
          return Promise.reject("user does not exist");
        } else {
          return true;
        }
      } catch (err) {
        console.log(err.message);
      }
    }),
  async (req, res) => {
    try {
      console.log(body("name")); // just to see all property of body and put any filed name to see all validation property name
      const errors = validationResult(req); // what ever the errors identify in middleware that dispaly in request because middleware use just before request and we can see that in validationResult and store it in variable called errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: formateErrors(errors.array()) });
      }
      const product = await Product.create(req.body);
      return res.status(201).send(product);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const product = await Product.find().lean().exec();
    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.patch(
  "/:id",
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Must be atleast 3 characters"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Price must be greated than zero");
      } else {
        return true;
      }
    }),
  body("user_id")
    .notEmpty()
    .withMessage("user id is required")
    .custom(async (value, { req }) => {
      try {
        // first checking user exist
        const user = await User.findById(value).lean().exec();
        if (!user) {
          return Promise.reject("user does not exist");
        }
        // than checking the product exist
        const product = await Product.findById(req.params.id).lean().exec();
        if (!product) {
          return Promise.reject("product does not exist");
        } else if (product.user_id !== user._id) { // the user created this prodcut is not same the current user than
          return Promise.reject("This user is not allow to update the product");
        } else {
          return true;
        }
      } catch (err) {
        console.log(err.message);
      }
    }),
  async (req, res) => {
    try {
    //  console.log(body("name")); // just to see all property of body and put any filed name to see all validation property name
      const errors = validationResult(req); // what ever the errors identify in middleware that dispaly in request because middleware use just before request and we can see that in validationResult and store it in variable called errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: formateErrors(errors.array()) });
      }
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res.status(201).send(product);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

module.exports = router;
