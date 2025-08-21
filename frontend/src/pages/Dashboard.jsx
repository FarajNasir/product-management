import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../utils/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [productsResponse, recentResponse] = await Promise.all([
        productAPI.getAll({ limit: 1000 }),
        productAPI.getAll({ limit: 5, page: 1, sort: '-createdAt' })
      ])

      const products = productsResponse.data.products
      
      // Calculate stats
      const inStock = products.filter(p => p.stock_status === 'In Stock').length
      const lowStock = products.filter(p => p.stock_status === 'Low Stock').length
      const outOfStock = products.filter(p => p.stock_status === 'Out of Stock').length

      setStats({
        totalProducts: products.length,
        inStock,
        lowStock,
        outOfStock
      })

      setRecentProducts(recentResponse.data.products)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Total Products</h2>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">In Stock</h2>
              <p className="text-2xl font-bold">{stats.inStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Low Stock</h2>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Out of Stock</h2>
              <p className="text-2xl font-bold">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recently Added Products</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm">
            View All
          </Link>
        </div>
        
        {recentProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Product</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-center">Price</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {recentProducts.map((product) => (
                  <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        {product.product_image && (
                          <div className="w-8 h-8 flex-shrink-0 mr-3">
                            <img
                              className="w-full h-full rounded-full object-cover"
                              src={`/uploads/${product.product_image}`}
                              alt={product.product_name}
                            />
                          </div>
                        )}
                        <span className="font-medium">{product.product_name}</span>
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
                      <span className={`py-1 px-3 rounded-full text-xs ${
                        product.stock_status === 'In Stock' 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock_status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No products found. Add some products to get started.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/products/new"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded"
            >
              Add New Product
            </Link>
            <Link
              to="/vendors/new"
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-bold py-2 px-4 rounded"
            >
              Add New Vendor
            </Link>
            <Link
              to="/products"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center font-bold py-2 px-4 rounded"
            >
              View All Products
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">In Stock</span>
              <span className="font-bold">{stats.inStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Low Stock</span>
              <span className="font-bold">{stats.lowStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Out of Stock</span>
              <span className="font-bold">{stats.outOfStock}</span>
            </div>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${(stats.inStock / stats.totalProducts) * 100}%` }}
            ></div>
            <div 
              className="bg-yellow-400 h-2.5 rounded-full -mt-2.5" 
              style={{ width: `${((stats.inStock + stats.lowStock) / stats.totalProducts) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard