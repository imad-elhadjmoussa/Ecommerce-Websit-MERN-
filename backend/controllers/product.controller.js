const Product = require('../models/product.model');

// Create a new product
const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestSeller,
        } = req.body;

        const imageFiles = req.files;

        if (!imageFiles || imageFiles.length === 0) {
            return res.status(400).json({ success: false, message: 'No images uploaded' });
        }

        // Upload images one by one and collect URLs
        const imageUrls = await Promise.all(
            imageFiles.map((file) => uploadToCloudinary(file.buffer))
        );

        const newProduct = new Product({
            name,
            description,
            price: Number(price),
            images: imageUrls, // matches your schema
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestSeller: bestSeller === 'true',
            date: Date.now(),
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
        });
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Product not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
