import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const AdvancedSearch = ({ onSearch, onClear }) => {
  const [filters, setFilters] = useState({
    q: '',
    tag: '',
    author: '',
    sortBy: 'date',
    order: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      q: '',
      tag: '',
      author: '',
      sortBy: 'date',
      order: 'desc'
    });
    onClear();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="q"
              value={filters.q}
              onChange={handleChange}
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
              <input
                type="text"
                name="tag"
                value={filters.tag}
                onChange={handleChange}
                placeholder="e.g. javascript"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                name="author"
                value={filters.author}
                onChange={handleChange}
                placeholder="Author name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="popularity">Views</option>
                <option value="likes">Likes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                name="order"
                value={filters.order}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <X size={16} />
            <span>Clear</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;