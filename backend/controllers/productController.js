import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import { generateBarcode, generateQRCode } from '../utils/barcodeGenerator.js';

// @desc    Get all products with pagination and filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    let filter = {};
    if (req.query.category) {
      filter.product_category = req.query.category;
    }
    if (req.query.stock_status) {
      filter.stock_status = req.query.stock_status;
    }
    if (req.query.search) {
      filter.$or = [
        { product_name: { $regex: req.query.search, $options: 'i' } },
        { product_description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .populate('vendor_reference', 'vendor_name contact_person')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor_reference', 'vendor_name contact_person email phone');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
export const createProduct = async (req, res) => {
  try {
    // Generate a unique product ID
    const productId = `PROD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const product = new Product({
      ...req.body,
      product_id: productId,
      product_image: req.file ? req.file.filename : ''
    });
    
    const createdProduct = await product.save();
    await createdProduct.populate('vendor_reference', 'vendor_name contact_person');
    
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // If new image is uploaded, update the image field
    if (req.file) {
      req.body.product_image = req.file.filename;
    }

const updatedData = { ...req.body };

// Check product_qty and set stock_status accordingly
if (updatedData.product_qty !== undefined) {
  if (updatedData.product_qty === 0) {
    updatedData.stock_status = 'Out of Stock';
  } else if (updatedData.product_qty <= 5) {
    updatedData.stock_status = 'Low Stock';
  } else {
    updatedData.stock_status = 'In Stock';
  }
}
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,

      { new: true, runValidators: true }
    ).populate('vendor_reference', 'vendor_name contact_person');
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('product_category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate barcode for product
// @route   GET /api/products/:id/barcode
// @access  Public
export const getProductBarcode = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const barcode = await generateBarcode(product.product_id);
    res.set('Content-Type', 'image/png');
    res.send(barcode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate QR code for product
// @route   GET /api/products/:id/qrcode
// @access  Public
export const getProductQRCode = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const qrCode = await generateQRCode(product.product_id);
    res.set('Content-Type', 'image/png');
    res.send(qrCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};