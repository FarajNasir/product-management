import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Public
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ vendor_name: 1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Public
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new vendor
// @route   POST /api/vendors
// @access  Public
export const createVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    const createdVendor = await vendor.save();
    res.status(201).json(createdVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Public
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Public
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    // Check if vendor has products
   //const Product = require('../models/Product.js');
   
    const productsCount = await Product.countDocuments({ vendor_reference: req.params.id });
    
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete vendor with associated products' 
      });
    }
    
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};