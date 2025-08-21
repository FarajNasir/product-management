import { useState } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../utils/api'
import BarcodeModal from './BarcodeModal'
import QRCodeModal from './QRCodeModal'

const ProductTable = ({ products, onDelete }) => {
  const [showBarcodeModal, setShowBarcodeModal] = useState(false)
  const [showQRCodeModal, setShowQRCodeModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [barcodeImage, setBarcodeImage] = useState('')
  const [qrCodeImage, setQRCodeImage] = useState('')

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id)
        onDelete()
      } catch (err) {
        console.error('Failed to delete product:', err)
        alert('Failed to delete product')
      }
    }
  }

  const handleShowBarcode = async (product) => {
    try {
      setSelectedProduct(product)
      const response = await productAPI.getBarcode(product._id)
      const imageUrl = URL.createObjectURL(response.data)
      setBarcodeImage(imageUrl)
      setShowBarcodeModal(true)
    } catch (err) {
      console.error('Failed to generate barcode:', err)
    }
  }

  const handleShowQRCode = async (product) => {
    try {
      setSelectedProduct(product)
      const response = await productAPI.getQRCode(product._id)
      const imageUrl = URL.createObjectURL(response.data)
      setQRCodeImage(imageUrl)
      setShowQRCodeModal(true)
    } catch (err) {
      console.error('Failed to generate QR code:', err)
    }
  }

  const getStockStatusClass = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800'
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'Out of Stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-center">Price</th>
              <th className="py-3 px-6 text-center">Quantity</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Vendor</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    {product.product_image && (
                      <div className="w-10 h-10 flex-shrink-0 mr-3">
                        <img
                          className="w-full h-full rounded-full object-cover"
                          src={`/uploads/${product.product_image}`}
                          alt={product.product_name}
                        />
                      </div>
                    )}
                    <div>
                      <span className="font-medium">{product.product_name}</span>
                      {product.product_description && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {product.product_description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  {product.product_category}
                </td>
                <td className="py-3 px-6 text-center">
                  ${product.final_price?.toFixed(2) || '0.00'}
                </td>
                <td className="py-3 px-6 text-center">
                  {product.product_qty}
                </td>
                <td className="py-3 px-6 text-center">
                  <span className={`py-1 px-3 rounded-full text-xs ${getStockStatusClass(product.stock_status)}`}>
                    {product.stock_status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  {product.vendor_reference?.vendor_name}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    <button
                      onClick={() => handleShowBarcode(product)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Barcode"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleShowQRCode(product)}
                      className="text-green-500 hover:text-green-700"
                      title="QR Code"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <Link
                      to={`/products/edit/${product._id}`}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Barcode Modal */}
      {showBarcodeModal && (
        <BarcodeModal
          product={selectedProduct}
          barcodeImage={barcodeImage}
          onClose={() => setShowBarcodeModal(false)}
        />
      )}

      {/* QR Code Modal */}
      {showQRCodeModal && (
        <QRCodeModal
          product={selectedProduct}
          qrCodeImage={qrCodeImage}
          onClose={() => setShowQRCodeModal(false)}
        />
      )}
    </>
  )
}

export default ProductTable