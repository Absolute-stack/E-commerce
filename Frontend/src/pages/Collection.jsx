import { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import './Collection.css';
import { ShopContext } from '../contxt/ShopContext';
import ProductItem from '../components/Productitem';

function Collection() {
  const { products, filterProducts, setFilterProducts } =
    useContext(ShopContext);

  const [sort, setSort] = useState('New Arrivals');
  const [sidebar, setSidebar] = useState('');

  // NEW STATES
  const [openSize, setOpenSize] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  function toggleSidebar() {
    setSidebar(sidebar === '' ? 'active' : '');
  }

  // sidebar top sticky
  useEffect(() => {
    const container = document.querySelector('.filters-container');

    function autoaddFixed() {
      if (window.scrollY > 210) {
        container.classList.add('active');
      } else {
        container.classList.remove('active');
      }
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          autoaddFixed();
          ticking = false;
        });
      }
      ticking = true;
    });
  }, []);

  // HANDLE SIZE FILTER
  function handleSizeChange(e) {
    const value = e.target.value;
    setSelectedSizes((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  // HANDLE CATEGORY FILTER
  function handleCategoryChange(e) {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  // FILTER + SORT LOGIC
  useEffect(() => {
    if (!products || products.length === 0) return;

    let filtered = [...products];

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
  }, [products, selectedSizes, selectedCategories, sort, setFilterProducts]);

  return (
    <section className="collection">
      {/* SIDEBAR */}
      <div className={`sidebar ${sidebar}`}>
        <div className="sidebar-top flex-sb">
          <p>Filters</p>
          <p onClick={toggleSidebar} className={`close-sidebar-btn ${sidebar}`}>
            X
          </p>
        </div>

        {/* SIZE FILTER SECTION */}
        <div className="sidebar-item">
          <div
            className="flex-sb sidebar-item-headers"
            onClick={() => setOpenSize(!openSize)}
          >
            <h2 className="sidebar-item-header">Size</h2>
            <p className={`entity ${openSize ? 'active' : ''}`}>&#8964;</p>
          </div>

          <div
            className={`filters-checkbox-containers flex gap-05 ${
              openSize ? 'active' : ''
            }`}
          >
            {products.length > 0
              ? [...new Set(products.flatMap((p) => p.sizes || []))].map(
                  (size, index) => (
                    <label className="flex gap-05" key={index}>
                      <input
                        type="checkbox"
                        value={size}
                        onChange={handleSizeChange}
                      />
                      <p>{size}</p>
                    </label>
                  )
                )
              : 'Loading'}
          </div>
        </div>

        {/* CATEGORY FILTER SECTION */}
        <div className="sidebar-item">
          <div
            className="flex-sb sidebar-item-headers"
            onClick={() => setOpenCategory(!openCategory)}
          >
            <h2 className="sidebar-item-header">Category</h2>
            <p className={`entity ${openCategory ? 'active' : ''}`}>&#8964;</p>
          </div>

          <div
            className={`filters-checkbox-containers flex gap-05 ${
              openCategory ? 'active' : ''
            }`}
          >
            {products.length > 0
              ? [...new Set(products.map((p) => p.category))].map(
                  (category, index) => (
                    <label className="flex gap-05" key={index}>
                      <input
                        type="checkbox"
                        value={category}
                        onChange={handleCategoryChange}
                      />
                      <p>{category}</p>
                    </label>
                  )
                )
              : 'Loading'}
          </div>
        </div>
      </div>

      <div className="title-container">
        <Title text1="ALL" text2="COLLECTION" />
      </div>

      {/* FILTERS TOP BAR */}
      <div className="filters-container">
        <div className="filter-btn-container">
          <button onClick={toggleSidebar} className={`filter-btn ${sidebar}`}>
            Filters
          </button>
        </div>

        <div className="select-container flex gap-05">
          <p>Sort</p>
          <select onChange={(e) => setSort(e.target.value)}>
            <option value="New Arrivals">New Arrivals</option>
            <option value="Low-High">Price Low To High</option>
            <option value="High-Low">Price High To Low</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="img-grid">
        {filterProducts?.length > 0
          ? filterProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))
          : 'Loading products...'}
      </div>
    </section>
  );
}

export default Collection;
