import { useContext, useEffect, useState, useMemo } from 'react';
import { ShopContext } from '../contxt/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/Productitem';
import './Collection.css';

function Collection() {
  const { products, filterProducts, setFilterProducts } =
    useContext(ShopContext);

  const [sort, setSort] = useState('New Arrivals');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize unique sizes and categories
  const allSizes = useMemo(() => {
    return [...new Set(products.flatMap((p) => p.sizes || []))];
  }, [products]);

  const allCategories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const activeFiltersCount = useMemo(() => {
    return (
      selectedSizes.length + selectedCategories.length + (searchQuery ? 1 : 0)
    );
  }, [selectedSizes.length, selectedCategories.length, searchQuery]);

  // Check if products are loaded - IMPROVED
  useEffect(
    function checkProductsLoaded() {
      // Set loading to false once products array exists (even if empty)
      if (Array.isArray(products)) {
        setIsLoading(false);
        console.log('Products loaded in Collection:', products.length); // Debug log
      }
    },
    [products]
  );

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

  // HANDLE SEARCH INPUT
  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  // HANDLE SORT CHANGE
  function handleSortChange(e) {
    setSort(e.target.value);
  }

  // TOGGLE FILTERS PANEL
  function toggleFilters() {
    setShowFilters((prev) => !prev);
  }

  // FILTER + SORT LOGIC
  useEffect(
    function applyFiltersAndSort() {
      if (!products || products.length === 0) {
        setFilterProducts([]);
        return;
      }

      let filtered = [...products];

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
      }

      // Filter by size
      if (selectedSizes.length > 0) {
        filtered = filtered.filter((p) =>
          p.sizes?.some((s) => selectedSizes.includes(s))
        );
      }

      // Filter by category
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((p) =>
          selectedCategories.includes(p.category)
        );
      }

      // Sorting
      switch (sort) {
        case 'Low-High':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'High-Low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'New Arrivals':
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        default:
          break;
      }

      setFilterProducts(filtered);
    },
    [
      products,
      searchQuery,
      selectedSizes,
      selectedCategories,
      sort,
      setFilterProducts,
    ]
  );

  // LOADING SKELETON
  if (isLoading) {
    return (
      <div className="collection-loading">
        <div className="skeleton-title"></div>

        <div className="skeleton-topbar">
          <div className="skeleton-search"></div>
          <div className="skeleton-controls">
            <div className="skeleton-filter-btn"></div>
            <div className="skeleton-sort-btn"></div>
          </div>
        </div>

        <div className="skeleton-results"></div>

        <div className="skeleton-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="skeleton-product-card">
              <div className="skeleton-product-image"></div>
              <div className="skeleton-product-info">
                <div className="skeleton-product-name"></div>
                <div className="skeleton-product-price"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="collection">
      <div className="title-container">
        <Title text1="ALL" text2="COLLECTION" />
      </div>

      {/* TOP BAR */}
      <div className="collection-topbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search products"
          />
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        <div className="controls-group">
          <button
            className={`filters-toggle ${showFilters ? 'active' : ''}`}
            onClick={toggleFilters}
            aria-expanded={showFilters}
            aria-label="Toggle filters"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            Filters
            {activeFiltersCount > 0 && (
              <span
                className="filter-badge"
                aria-label={`${activeFiltersCount} active filters`}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="sort-dropdown">
            <select
              value={sort}
              onChange={handleSortChange}
              aria-label="Sort products"
            >
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
            <button
              className="clear-filters"
              onClick={clearAllFilters}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="filters-content">
          {allCategories.length > 0 && (
            <div className="filter-section">
              <h4>Categories</h4>
              <div
                className="filter-chips"
                role="group"
                aria-label="Category filters"
              >
                {allCategories.map((category) => (
                  <button
                    key={category}
                    className={`filter-chip ${
                      selectedCategories.includes(category) ? 'active' : ''
                    }`}
                    onClick={() => handleCategoryChange(category)}
                    aria-pressed={selectedCategories.includes(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {allSizes.length > 0 && (
            <div className="filter-section">
              <h4>Sizes</h4>
              <div
                className="filter-chips"
                role="group"
                aria-label="Size filters"
              >
                {allSizes.map((size) => (
                  <button
                    key={size}
                    className={`filter-chip ${
                      selectedSizes.includes(size) ? 'active' : ''
                    }`}
                    onClick={() => handleSizeChange(size)}
                    aria-pressed={selectedSizes.includes(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
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
