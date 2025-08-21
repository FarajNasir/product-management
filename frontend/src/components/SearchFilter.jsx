import { useState, useEffect } from 'react'
import { productAPI } from '../utils/api'

const SearchFilter = ({ filters, onChange, showCategoryFilter = false, showStockFilter = false }) => {
  const [categories, setCategories] = useState([])
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    if (showCategoryFilter) {
      fetchCategories()
    }
  }, [showCategoryFilter])

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories()
      setCategories(response.data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onChange(newFilters)
  }

  return (
    <div className="bg-white shadow-md rounded p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search products..."
            value={localFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Category Filter */}
        {showCategoryFilter && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={localFilters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stock Status Filter */}
        {showStockFilter && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock_status">
              Stock Status
            </label>
            <select
              id="stock_status"
              value={localFilters.stock_status || ''}
              onChange={(e) => handleFilterChange('stock_status', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        )}

        {/* Results Per Page */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="limit">
            Results Per Page
          </label>
          <select
            id="limit"
            value={localFilters.limit || 10}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchFilter