import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true
  },
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  product_category: {
    type: String,
    required: true,
    trim: true
  },
  product_price: {
    type: Number,
    required: true,
    min: 0
  },
  product_tax: {
    type: Number,
    required: true,
    min: 0
  },
  product_qty: {
    type: Number,
    required: true,
    min: 0
  },
  product_image: {
    type: String,
    default: ''
  },
  product_description: {
    type: String,
    trim: true
  },
  product_discount: {
    type: Number,
    default: 0,
    min: 0
  },
  purchase_date: {
    type: Date,
    required: true
  },
  vendor_reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  final_price: {
    type: Number,
    min: 0
  },
   stock_status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: function () {
      if (this.product_qty === 0) return 'Out of Stock';
      if (this.product_qty <= 5) return 'Low Stock';
      return 'In Stock';
    }
  }
}, {
  timestamps: true
});

// Calculate final price before saving
productSchema.pre('save', function(next) {
  const priceAfterDiscount = this.product_price - (this.product_price * (this.product_discount / 100));
  this.final_price = priceAfterDiscount + (priceAfterDiscount * (this.product_tax / 100));
  

  
  next();
});




export default mongoose.model('Product', productSchema);