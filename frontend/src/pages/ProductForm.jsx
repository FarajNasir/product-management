import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { productAPI, vendorAPI } from '../utils/api'
import dayjs from 'dayjs'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      product_name: '',
      product_category: '',
      product_price: 0,
      product_tax: 0,
      product_qty: 0,
      product_description: '',
      product_discount: 0,
      purchase_date: dayjs().format('YYYY-MM-DD'),
      vendor_reference: ''
    }
  })

  // Watch for price, tax, and discount changes to calculate final price
  const price = watch('product_price', 0)
  const tax = watch('product_tax', 0)
  const discount = watch('product_discount', 0)

  const calculateFinalPrice = () => {
    const priceAfterDiscount = price - (price * (discount / 100))
    return priceAfterDiscount + (priceAfterDiscount * (tax / 100))
  }

  const finalPrice = calculateFinalPrice()

  // Dropzone for image upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 1000000, // 1MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setValue('product_image', acceptedFiles[0])
        setImagePreview(URL.createObjectURL(acceptedFiles[0]))
      }
    }
  })

  useEffect(() => {
    fetchVendors()
    
    if (isEdit) {
      fetchProduct()
    }
  }, [id])

  const fetchVendors = async () => {
    try {
      const response = await vendorAPI.getAll()
      setVendors(response.data)
    } catch (err) {
      setError('Failed to fetch vendors')
      console.error(err)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id)
      const product = response.data
      
      // Set form values
      Object.keys(product).forEach(key => {
        if (key === 'purchase_date') {
          setValue(key, dayjs(product[key]).format('YYYY-MM-DD'))
        } else if (key !== 'product_image' && key !== '_id' && key !== '__v') {
          setValue(key, product[key])
        }
      })
      
      if (product.product_image) {
        setImagePreview(`/uploads/${product.product_image}`)
      }
    } catch (err) {
      setError('Failed to fetch product')
      console.error(err)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      if (isEdit) {
        await productAPI.update(id, data)
      } else {
        await productAPI.create(data)
      }
      
      navigate('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const productImage = watch('product_image')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_name">
              Product Name *
            </label>
            <input
              id="product_name"
              type="text"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.product_name ? 'border-red-500' : ''
              }`}
              {...register('product_name', { required: 'Product name is required' })}
            />
            {errors.product_name && (
              <p className="text-red-500 text-xs italic">{errors.product_name.message}</p>
            )}
          </div>

          {/* Product Category */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_category">
              Category *
            </label>
            <input
              id="product_category"
              type="text"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.product_category ? 'border-red-500' : ''
              }`}
              {...register('product_category', { required: 'Category is required' })}
            />
            {errors.product_category && (
              <p className="text-red-500 text-xs italic">{errors.product_category.message}</p>
            )}
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_price">
              Price ($) *
            </label>
            <input
              id="product_price"
              type="number"
              step="0.01"
              min="0"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.product_price ? 'border-red-500' : ''
              }`}
              {...register('product_price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
            />
            {errors.product_price && (
              <p className="text-red-500 text-xs italic">{errors.product_price.message}</p>
            )}
          </div>

          {/* Product Tax */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_tax">
              Tax (%) *
            </label>
            <input
              id="product_tax"
              type="number"
              step="0.01"
              min="0"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.product_tax ? 'border-red-500' : ''
              }`}
              {...register('product_tax', { 
                required: 'Tax is required',
                min: { value: 0, message: 'Tax must be positive' }
              })}
            />
            {errors.product_tax && (
              <p className="text-red-500 text-xs italic">{errors.product_tax.message}</p>
            )}
          </div>

          {/* Product Quantity */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_qty">
              Quantity *
            </label>
            <input
              id="product_qty"
              type="number"
              min="0"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.product_qty ? 'border-red-500' : ''
              }`}
              {...register('product_qty', { 
                required: 'Quantity is required',
                min: { value: 0, message: 'Quantity must be positive' }
              })}
            />
            {errors.product_qty && (
              <p className="text-red-500 text-xs italic">{errors.product_qty.message}</p>
            )}
          </div>

          {/* Product Discount */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_discount">
              Discount (%)
            </label>
            <input
              id="product_discount"
              type="number"
              step="0.01"
              min="0"
              max="100"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('product_discount')}
            />
          </div>

          {/* Final Price (Readonly) */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="final_price">
              Final Price
            </label>
            <input
              id="final_price"
              type="text"
              readOnly
              value={`$${finalPrice.toFixed(2)}`}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchase_date">
              Purchase Date *
            </label>
            <input
              id="purchase_date"
              type="date"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.purchase_date ? 'border-red-500' : ''
              }`}
              {...register('purchase_date', { required: 'Purchase date is required' })}
            />
            {errors.purchase_date && (
              <p className="text-red-500 text-xs italic">{errors.purchase_date.message}</p>
            )}
          </div>

          {/* Vendor Reference */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vendor_reference">
              Vendor *
            </label>
            <select
              id="vendor_reference"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.vendor_reference ? 'border-red-500' : ''
              }`}
              {...register('vendor_reference', { required: 'Vendor is required' })}
            >
              <option value="">Select a vendor</option>
              {vendors.map(vendor => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.vendor_name} - {vendor.contact_person}
                </option>
              ))}
            </select>
            {errors.vendor_reference && (
              <p className="text-red-500 text-xs italic">{errors.vendor_reference.message}</p>
            )}
          </div>

          {/* Product Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_description">
              Description
            </label>
            <textarea
              id="product_description"
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('product_description')}
            />
          </div>

          {/* Product Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product Image
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 max-w-full mb-2 rounded"
                  />
                  <p className="text-sm text-gray-600">Click or drag to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600">
                    {isDragActive
                      ? 'Drop the image here'
                      : 'Drag & drop an image here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 1MB</p>
                </div>
              )}
            </div>
            {productImage && !imagePreview && (
              <p className="text-sm text-gray-600 mt-2">File selected: {productImage.name}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm