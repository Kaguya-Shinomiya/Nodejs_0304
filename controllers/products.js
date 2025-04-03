const slugify = require('slugify');
const ProductModel = require('../schemas/product');
const CategoryModel = require('../schemas/category');

module.exports = {
    /* Lấy tất cả sản phẩm */
    GetAllProducts: async () => {
        return await ProductModel.find({ isDeleted: false }).populate("category");
    },

    /* Lấy sản phẩm theo ID */
    GetProductById: async (id) => {
        let product = await ProductModel.findOne({ _id: id, isDeleted: false });
        if (!product) throw new Error("Product not found");
        return product;
    },

    /* Lấy sản phẩm theo slug và category */
    GetProductBySlug: async (categorySlug, productSlug) => {
        let category = await CategoryModel.findOne({ slug: categorySlug });
        if (!category) throw new Error("Category not found");

        let product = await ProductModel.findOne({ slug: productSlug, category: category._id, isDeleted: false });
        if (!product) throw new Error("Product not found");

        return product;
    },

    /* Lấy tất cả sản phẩm trong category */
    GetProductsByCategory: async (categorySlug) => {
        let category = await CategoryModel.findOne({ slug: categorySlug });
        if (!category) throw new Error("Category not found");

        return await ProductModel.find({ category: category._id, isDeleted: false });
    },

    /* Tạo sản phẩm mới */
    CreateNewProduct: async (name, price, quantity, categoryName) => {
        let category = await CategoryModel.findOne({ name: categoryName });
        if (!category) throw new Error("Invalid category");

        let slug = slugify(name, { lower: true, strict: true });

        // Kiểm tra trùng slug trong cùng category
        let existingProduct = await ProductModel.findOne({ slug, category: category._id, isDeleted: false });
        if (existingProduct) throw new Error("Product already exists in this category");

        let newProduct = new ProductModel({
            name,
            slug,
            price,
            quantity,
            category: category._id,
            isDeleted: false
        });

        return await newProduct.save();
    },

    /* Cập nhật sản phẩm */
    UpdateProduct: async (id, updateObj) => {
        let product = await ProductModel.findById(id);
        if (!product || product.isDeleted) throw new Error("Product not found");

        if (updateObj.name) {
            let newSlug = slugify(updateObj.name, { lower: true, strict: true });

            // Kiểm tra trùng slug trong cùng category
            let existingProduct = await ProductModel.findOne({ slug: newSlug, category: product.category, isDeleted: false });
            if (existingProduct && existingProduct._id.toString() !== id) {
                throw new Error("Another product with this name already exists in this category");
            }

            updateObj.slug = newSlug;
        }

        return await ProductModel.findByIdAndUpdate(id, updateObj, { new: true });
    },

    /* Xóa sản phẩm (đánh dấu isDeleted) */
    DeleteProduct: async (id) => {
        let product = await ProductModel.findById(id);
        if (!product || product.isDeleted) throw new Error("Product not found");

        return await ProductModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
};
