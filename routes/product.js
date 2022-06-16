/** @format */

"use strict";
/** @format */

const express = require("express");
const Joi = require("joi");
const Product = require("../db/schema/product");
const { responseObject } = require("../helpers");
const router = express.Router();
const debug = process.env.NODE_ENV !== "production";

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.json(responseObject(product, true));
  } catch (error) {
    debug && console.log({ error });
    next(new Error(`Could not find any product with id ${req.params?.id}`));
  }
}

async function getAllProduct(req, res, next) {
  try {
    const data = await Product.find();
    res.json(responseObject(data, true));
  } catch (error) {
    next(error);
  }
}

async function createNewProduct(req, res, next) {
  try {
    const body = req.body;
    const newProduct = new Product(body);
    await newProduct.save();
    res.statusCode = 200;
    res.json({
      data: newProduct,
      success: true,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProductById(req, res, next) {
  const { id } = req.params;
  const body = req.body;

  Product.updateOne({ _id: id }, body, async (error, response) => {
    if (error) {
      return next(
        new Error(`Unable to update product with id: ${req.params.id}`)
      );
    }
    const data = await Product.findById(id);
    res.json(responseObject(data, Boolean(response.modifiedCount)));
  });
}

async function deleteProductById(req, res) {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.deleteOne({ _id: id });

    res.statusCode = 200;
    res.json({
      data: null,
      success: deletedProduct.acknowledged,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @description Validates route request with joi schema
 * @param {object} options
 * @param {'body' | 'params'} options.type
 * @param {Joi.Schema} options.schema
 * @returns
 */
function validateRequest(options) {
  const { schema, type } = options;
  const isSchema = Joi.isSchema(schema);

  const { error: invalidateArgs } = Joi.object({
    type: Joi.string().valid("params", "body"),
  }).validate({ type });

  if (!isSchema || invalidateArgs) {
    throw new Error(invalidateArgs || "Invalid schema passed");
  }

  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (Boolean(error)) next(error);
    next();
  };
}

router.route("/").get(getAllProduct).post(createNewProduct);

router
  .route("/:id")
  .all((req, res, next) => {
    const schema = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    // result = {value: ..., error: ...}
    const result = schema.validate(req.params);
    const { error } = result;

    if (error) {
      res.statusCode = 422;
      const reqError = new Error("Invalid id param");
      return next(reqError);
    }
    next();
  })
  .get(getProductById)
  .put(
    validateRequest({
      schema: Joi.object({
        name: Joi.string(),
        price: Joi.number(),
        published: Joi.bool(),
        image: Joi.string(),
      }).or("name", "price", "published", "image"),
      type: "body",
    }),
    updateProductById
  )
  .delete(deleteProductById);

// @error
router.use((error, req, res, next) => {
  const fullPath = req.originalUrl;
  console.error({ [`ROUTE::${fullPath}`]: error?.message });
  res.statusCode = 500;

  next(error);
});

module.exports = router;
