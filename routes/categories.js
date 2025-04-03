var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');

// Lấy danh sách tất cả category
router.get('/', async function(req, res) {
  try {
    let categories = await categoryModel.find({});
    res.status(200).send({ success: true, data: categories });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Lấy category theo slug
router.get('/slug/:slug', async function(req, res) {
  try {
    let category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }
    res.status(200).send({ success: true, data: category });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Thêm mới category (Slug tự động tạo)
router.post('/', async function(req, res) {
  try {
    let newCategory = new categoryModel({ name: req.body.name });
    await newCategory.save();
    res.status(201).send({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
