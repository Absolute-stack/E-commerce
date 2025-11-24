import { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../contxt/ShopContext';
import './Product.css';

function Product() {
  const { backend, addToCart } = useContext(ShopContext);
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCH PRODUCT DATA
  const fetchProductData = useCallback(
    async function fetchProductData() {
      if (!productId) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.post(
          `${backend}/api/product/get`,
          { id: productId },
          { withCredentials: true }
        );

        if (res.data.productData) {
          setProduct(res.data.productData);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product. Please try again.');
        toast.error('Something went wrong. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    },
    [backend, productId]
  );

  // HANDLE SIZE SELECTION
  function handleSizeSelect(selectedSize) {
    setSize(selectedSize);
  }

  // HANDLE ADD TO CART
  function handleAddToCart() {
    addToCart(productId, size);
  }

  // FETCH PRODUCT ON MOUNT OR ID CHANGE
  useEffect(
    function loadProduct() {
      fetchProductData();
    },
    [fetchProductData]
  );

  // LOADING STATE with skeleton
  if (isLoading) {
    return (
      <div className="product-loading">
        <div className="skeleton-images">
          <div className="skeleton-image"></div>
          <div className="skeleton-image"></div>
          <div className="skeleton-image"></div>
          <div className="skeleton-image"></div>
          <div className="skeleton-image"></div>
        </div>

        <div className="skeleton-info">
          <div className="skeleton-title"></div>
          <div className="skeleton-price"></div>
          <div className="skeleton-description"></div>

          <div className="skeleton-sizes">
            <div className="skeleton-size"></div>
            <div className="skeleton-size"></div>
            <div className="skeleton-size"></div>
            <div className="skeleton-size"></div>
          </div>

          <div className="skeleton-button"></div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error || !product) {
    return (
      <div className="product-error">
        <p>{error || 'Product not found'}</p>
        <button onClick={fetchProductData}>Try Again</button>
      </div>
    );
  }

  // MAIN PRODUCT VIEW
  return (
    <section className="seperate">
      <div className="product-images-container">
        {product.image?.slice(0, 5).map((img, index) => (
          <div key={index} className="img-holder">
            <img
              src={img}
              alt={`${product.name} - Image ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="product-information">
        <h1>{product.name}</h1>

        {product.price && (
          <p className="product-price">GH₵ {product.price.toFixed(2)}</p>
        )}

        <p className="product-desc">{product.desc}</p>

        {/* SIZE SELECTOR */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="sizes-section">
            <h3>Select Size</h3>
            <div
              className="sizes-container flex gap-05"
              role="group"
              aria-label="Size options"
            >
              {product.sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSizeSelect(item)}
                  className={`size-btn ${size === item ? 'active' : ''}`}
                  aria-pressed={size === item}
                  aria-label={`Size ${item}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADD TO CART BUTTON */}
        <button
          className="atc-btn"
          onClick={handleAddToCart}
          disabled={!size}
          aria-label="Add to cart"
        >
          Add to Cart
        </button>

        {/* PRODUCT DETAILS */}
        {product.category && (
          <div className="product-meta">
            <p>
              Category: <strong>{product.category}</strong>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Product;
