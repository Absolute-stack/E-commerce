import { useContext, useEffect, useState, useMemo } from 'react';
import { ShopContext } from '../contxt/ShopContext.jsx';
import Title from './Title';
import Subtitle from './Subtitle';
import ProductItem from './Productitem';
import './LatestArrivals.css';

function LatestArrivals() {
  const { products } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize latest products to prevent recalculation on every render
  const latestProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [products]);

  // Check if products are loaded
  useEffect(
    function checkProductsLoaded() {
      if (products && products.length > 0) {
        setIsLoading(false);
      }
    },
    [products]
  );

  // LOADING SKELETON
  if (isLoading) {
    return (
      <div className="latest-arrivals-loading">
        <div className="skeleton-title-wrapper">
          <div className="skeleton-title"></div>
        </div>
        <div className="skeleton-subtitle"></div>

        <div className="img-grid">
          {[...Array(4)].map((_, index) => (
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

  // EMPTY STATE
  if (latestProducts.length === 0) {
    return (
      <div className="latest-arrivals-empty">
        <Title text1="Latest" text2="Arrivals" />
        <p>No products available yet. Check back soon!</p>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <section className="latest-arrivals">
      <Title text1="Latest" text2="Arrivals" />
      <Subtitle text="Step into the newest Darkah creations — pieces shaped with intention, designed to echo the quiet power and refined confidence of the modern woman." />

      <div className="img-grid">
        {latestProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
}

export default LatestArrivals;
