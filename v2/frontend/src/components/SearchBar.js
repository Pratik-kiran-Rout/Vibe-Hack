import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Search blogs..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 text-lg placeholder-gray-400 shadow-sm"
        />
        {query && (
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;