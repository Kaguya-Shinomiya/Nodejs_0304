var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');
let categoryModel = require('../schemas/category');

// Lấy danh sách sản phẩm
router.get('/', async function(req, res) {
  try {
    let products = await productModel.find().populate("category");
    res.status(200).send({ success: true, data: products });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Lấy sản phẩm theo ID
router.get('/:id', async function(req, res) {
  try {
    let product = await productModel.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    res.status(200).send({ success: true, data: product });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Thêm mới sản phẩm (Slug tự động tạo)
router.post('/', async function(req, res) {
  try {
    let category = await categoryModel.findOne({ name: req.body.category });
    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }

    let newProduct = new productModel({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: category._id,
      description: req.body.description,
      imgURL: req.body.imgURL
    });

    await newProduct.save();
    res.status(201).send({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Lấy sản phẩm theo slug của category
router.get('/slug/:category', async function(req, res) {
  try {
    let category = await categoryModel.findOne({ slug: req.params.category });
    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }

    let products = await productModel.find({ category: category._id });
    res.status(200).send({ success: true, data: products });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Lấy sản phẩm theo slug của category và product
router.get('/slug/:category/:product', async function(req, res) {
  try {
    let category = await categoryModel.findOne({ slug: req.params.category });
    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }

    let product = await productModel.findOne({ slug: req.params.product, category: category._id });
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    res.status(200).send({ success: true, data: product });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
