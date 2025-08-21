import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  vendor_name: {
    type: String,
    required: true,
    trim: true
  },
  contact_person: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  tax_id: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Vendor', vendorSchema);