import { use, useContext, useEffect, useState } from 'react';
import { ShopContext } from '../contxt/ShopContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Product.css';
import axios from 'axios';
function Product() {
  const { products, backend, cartItems, addToCart, getCartQuantity } =
    useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [size, setSize] = useState('');

  async function fetchProductData() {
    try {
      const res = await axios.post(
        backend + '/api/product/get',
        { id: productId },
        {
          withCredentials: true,
        }
      );
      setProduct(res.data.productData);
    } catch (error) {
      toast.error(
        'Something Went Wrong Please Try agian or Refresh Page Later.'
      );
    }
  }

  useEffect(() => {
    products.length > 0 ? fetchProductData() : () => console.log(error.message);
  }, [products]);

  useEffect(() => {
    console.log(getCartQuantity());
  }, [cartItems]);

  return product && Object.keys(product).length > 0 ? (
    <>
      <section className="seperate">
        <div className="product-images-container">
          <div className="img-holder">
            <img src={product.image[0]} alt="" />
          </div>
          <div className="img-holder">
            <img src={product.image[1]} alt="" />
          </div>
          <div className="img-holder">
            <img src={product.image[2]} alt="" />
          </div>
          <div className="img-holder">
            <img src={product.image[3]} alt="" />
          </div>
          <div className="img-holder">
            <img src={product.image[4]} alt="" />
          </div>
        </div>
        <div className="product-information">
          <h3>{product.name}</h3>
          <p className="product-desc">{product.desc}</p>
          <div className="sizes-container flex gap-05">
            {product.sizes?.map((item, index) => {
              return (
                <button
                  onClick={() => {
                    setSize(item);
                  }}
                  key={index}
                  className={`size-btn ${size === item ? 'active' : ''}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <button
            className="atc-btn"
            onClick={() => {
              addToCart(productId, size);
            }}
          >
            {' '}
            ADD To Cart Button
          </button>
        </div>
      </section>
    </>
  ) : (
    'Loading'
  );
}

export default Product;
