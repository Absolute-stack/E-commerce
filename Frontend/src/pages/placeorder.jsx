import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../contxt/ShopContext';
import './Placeorders.css';

function PlaceOrders() {
  const { cartItems, getCartToTalPrice, products, user } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_KEY;

  const [loadingUser, setLoadingUser] = useState(true);

  // Wait for user to be loaded
  useEffect(() => {
    if (user !== null) setLoadingUser(false);
  }, [user]);

  // --------------------------
  // Checkout Form Component
  // --------------------------
  function CheckoutForm({ onSubmit }) {
    const [address, setAddress] = useState({
      fullname: '',
      phone: '',
      region: '',
      city: '',
      street: '',
    });

    function handleChange(e) {
      setAddress({ ...address, [e.target.name]: e.target.value });
    }

    function submitForm(e) {
      e.preventDefault();
      onSubmit(address);
    }

    return (
      <form onSubmit={submitForm} className="checkout-form">
        <input
          name="fullname"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <input
          name="region"
          placeholder="Region"
          onChange={handleChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
        />
        <input
          name="street"
          placeholder="Street Address"
          onChange={handleChange}
          required
        />
        <button type="submit">Continue to Payment</button>
      </form>
    );
  }

  // --------------------------
  // Checkout Handler
  // --------------------------
  function handleCheckout(addressData) {
    if (!user) {
      toast.error('You must be logged in to checkout');
      return navigate('/login');
    }

    if (!user.email) {
      toast.error('User email missing. Cannot initialize payment.');
      return;
    }

    // Build cart details
    const cartDetails = [];
    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {
        cartDetails.push({
          productId,
          name: product.name,
          size,
          price: product.price,
          quantity: cartItems[productId][size],
        });
      }
    }

    const totalAmount = getCartToTalPrice() + 20;
    if (!totalAmount || isNaN(totalAmount)) {
      toast.error('Cart total invalid');
      return;
    }

    // --------------------------
    // PAYSTACK POPUP
    // --------------------------
    const handler = PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: user.email,
      amount: totalAmount * 100, // convert to pesewas
      currency: 'GHS',
      metadata: {
        userId: user._id,
        items: JSON.stringify(cartDetails),
        address: JSON.stringify(addressData),
      },
      callback: function (response) {
        navigate(`/verify?reference=${response.reference}`);
      },
      onClose: function () {
        toast.info('Payment cancelled');
      },
    });

    handler.openIframe();
  }

  // --------------------------
  // Render
  // --------------------------
  if (loadingUser) return <p>Loading user data...</p>;

  return (
    <div>
      <h2 className="checkout-title">Checkout</h2>
      <CheckoutForm onSubmit={handleCheckout} />
    </div>
  );
}

export default PlaceOrders;
