import { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import './Collection.css';
import { ShopContext } from '../contxt/ShopContext';
import ProductItem from '../components/Productitem';

function Collection() {
  const { products, filterProducts, setFilterProducts } =
    useContext(ShopContext);

  const [sort, setSort] = useState('New Arrivals');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Get unique sizes and categories
  const allSizes = [...new Set(products.flatMap((p) => p.sizes || []))];
  const allCategories = [...new Set(products.map((p) => p.category))];

  // HANDLE SIZE FILTER
  function handleSizeChange(size) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  // HANDLE CATEGORY FILTER
  function handleCategoryChange(category) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  // CLEAR ALL FILTERS
  function clearAllFilters() {
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSearchQuery('');
  }

  // Active filters count
  const activeFiltersCount =
    selectedSizes.length + selectedCategories.length + (searchQuery ? 1 : 0);

  // FILTER + SORT LOGIC
  useEffect(() => {
    if (!products || products.length === 0) return;

    let filtered = [...products];

    // filter by search
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // filter by size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // sorting
    if (sort === 'Low-High') {
      filtered.sort((a, b) => a.price - b.price);
    }
    if (sort === 'High-Low') {
      filtered.sort((a, b) => b.price - a.price);
    }
    if (sort === 'New Arrivals') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilterProducts(filtered);
  }, [
    products,
    searchQuery,
    selectedSizes,
    selectedCategories,
    sort,
    setFilterProducts,
  ]);

  return (
    <section className="collection">
      <div className="title-container">
        <Title text1="ALL" text2="COLLECTION" />
      </div>

      {/* TOP BAR */}
      <div className="collection-topbar">
        {/* Search Bar */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        {/* Filter & Sort Controls */}
        <div className="controls-group">
          <button
            className={`filters-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            Filters
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
          </button>

          <div className="sort-dropdown">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="New Arrivals">Newest First</option>
              <option value="Low-High">Price: Low to High</option>
              <option value="High-Low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* FILTERS PANEL */}
      <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
        <div className="filters-header">
          <h3>Filters</h3>
          {activeFiltersCount > 0 && (
            <button className="clear-filters" onClick={clearAllFilters}>
              Clear All
            </button>
          )}
        </div>

        <div className="filters-content">
          {/* Categories */}
          <div className="filter-section">
            <h4>Categories</h4>
            <div className="filter-chips">
              {allCategories.map((category) => (
                <button
                  key={category}
                  className={`filter-chip ${
                    selectedCategories.includes(category) ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="filter-section">
            <h4>Sizes</h4>
            <div className="filter-chips">
              {allSizes.map((size) => (
                <button
                  key={size}
                  className={`filter-chip ${
                    selectedSizes.includes(size) ? 'active' : ''
                  }`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>
          Showing <strong>{filterProducts?.length || 0}</strong> of{' '}
          <strong>{products.length}</strong> products
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="img-grid">
        {filterProducts?.length > 0 ? (
          filterProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))
        ) : (
          <div className="no-results">
            <p>No products found</p>
            <button onClick={clearAllFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Collection;
