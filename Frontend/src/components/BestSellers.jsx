2import { useContext, useEffect, useState, useMemo } from 'react';
import { ShopContext } from '../contxt/ShopContext';
import Title from './Title';
import Subtitle from './Subtitle';
import ProductItem from './Productitem';
import './Bestsellers.css';

function Bestsellers() {
  const { products } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize bestsellers to prevent recalculation on every render
  const bestsellers = useMemo(() => {
    if (!products || products.length === 0) return [];

    return [...products].filter((item) => item.bestseller).slice(0, 4);
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
      <div className="bestsellers-loading">
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
  if (bestsellers.length === 0) {
    return (
      <div className="bestsellers-empty">
        <Title text1="Best" text2="Sellers" />
        <p>No bestsellers available yet. Check back soon!</p>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <section className="bestsellers">
      <Title text1="Best" text2="Sellers" />
      <Subtitle text="Discover the Darkah signatures women return to — pieces that have earned their place not by trend, but by the way they make you feel unstoppable." />

      <div className="img-grid">
        {bestsellers.map((item) => (
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

export default Bestsellers;
