const express = require("express");
const Product = require("../models/product.model");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { formateErrors } = require("../utils/validation");
router.post(
  "/",
  body("name")   // we will passing as middleware 
    .notEmpty()
    .withMessage("Name is required") 
    .isLength({ min: 3 })
    .withMessage("Must be atleast 3 characters"),
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

module.exports = router;
