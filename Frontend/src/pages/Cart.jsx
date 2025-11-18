import { useContext } from 'react';
import Title from '../components/Title';
import './Cart.css';
import { ShopContext } from '../contxt/ShopContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../assets/assest';
import { Link } from 'react-router-dom';

function Cart() {
  const { cartItems, products, updateCart, getCartToTalPrice } =
    useContext(ShopContext);
  const [tempData, setTempData] = useState([]);

  async function fetchCart() {
    const cartData = [];
    if (cartItems && Object.keys(cartItems).length > 0) {
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            cartData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
    }
    return setTempData(cartData);
  }

  useEffect(() => {
    if (cartItems && Object.keys(cartItems).length > 0) {
      fetchCart();
    }
  }, [cartItems]);
  return (
    <>
      <section>
        <div className="cart-title-container">
          <Title text1={'My'} text2={'Cart'} />
        </div>
        <div className="cart-items-container">
          <div className="cart-items">
            {tempData.map((item, index) => {
              const productInfo = products.find((p) => p._id === item._id);

              if (!productInfo) return null;

              return (
                <div key={index} className="cart-item">
                  <div className="product-img-container">
                    <img src={productInfo.image[0]} alt={productInfo.name} />
                  </div>

                  <p>{productInfo.name}</p>
                  <p>Size: {item.size}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: GH₵ {`  ${productInfo.price * item.quantity}`}</p>
                  <button
                    className="delete-cartitem-btn"
                    onClick={() => updateCart(item._id, item.size, 0)}
                  >
                    <img src={assets.bin} alt="" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cart-total">
          <div className="cart-total-title">
            <Title text1="cart" text2="totals" />
          </div>

          <div className="cart-total-details">
            <p className="flex gap-05">
              <span>Subtotal:</span> GH₵ {getCartToTalPrice()}
            </p>
            <p className="flex gap-05">
              <span>Shipping:</span> GH₵ {getCartToTalPrice() > 0 ? 20 : 0}
            </p>
            <p className="cart-total-final flex gap-05">
              <span>Total:</span> GH₵{' '}
              {getCartToTalPrice() + (getCartToTalPrice() > 0 ? 20 : 0)}
            </p>
            <Link to="/placeorder">
              <button className="po-btn">Place Order</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
