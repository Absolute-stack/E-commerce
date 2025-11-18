import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ShopContext = createContext();

function ShopContextProvider({ children }) {
  const currency = 'GH₵';
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [showSearchbar, setShowSearchbar] = useState(false);

  // -------------------------
  // FETCH PRODUCTS
  // -------------------------
  async function fetchProducts() {
    try {
      const res = await axios.get(backend + '/api/product/list', {
        withCredentials: true,
      });

      const allProducts = res.data?.allProducts || [];
      setProducts(allProducts);
      setFilterProducts(structuredClone(allProducts));
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please refresh the page.');
    }
  }

  // -------------------------
  // FETCH CART FROM BACKEND
  // -------------------------
  async function fetchCart() {
    try {
      const res = await axios.post(
        backend + '/api/cart/get',
        {},
        { withCredentials: true }
      );

      setCartItems(res.data.cartData || {});
    } catch (error) {
      console.log(error);
    }
  }

  // -------------------------
  // ADD TO CART (FRONTEND + BACKEND SYNC)
  // -------------------------
  async function addToCart(itemId, size) {
    if (!size) return toast.error('Please Select A Size');

    try {
      const res = await axios.post(
        backend + '/api/cart/add',
        { itemId, size },
        { withCredentials: true }
      );

      setCartItems(res.data.cartData);
    } catch (error) {
      console.log(error);
      toast.error('Failed to add item. PLease Login and Try Again');
    }
  }

  // -------------------------
  // UPDATE CART (FRONTEND + BACKEND SYNC)
  // -------------------------
  async function updateCart(itemId, size, quantity) {
    try {
      const res = await axios.post(
        backend + '/api/cart/update',
        { itemId, size, quantity },
        { withCredentials: true }
      );

      setCartItems(res.data.cartData);
    } catch (error) {
      console.log(error);
      toast.error('Failed to update cart. Please Login and Try Again');
    }
  }

  // -------------------------
  // CLEAR CART (NEW FUNCTION)
  // -------------------------
  async function clearCart() {
    try {
      // Clear cart on backend
      const res = await axios.post(
        backend + '/api/cart/clear',
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        // Clear cart on frontend
        setCartItems({});
        console.log('Cart cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Still clear frontend cart even if backend fails
      setCartItems({});
    }
  }

  // -------------------------
  // GET TOTAL CART QUANTITY
  // -------------------------
  function getCartQuantity() {
    let cartQuantity = 0;

    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        cartQuantity += cartItems[items][size];
      }
    }

    return cartQuantity;
  }

  // -------------------------
  // GET CART TOTAL PRICE
  // -------------------------
  function getCartToTalPrice() {
    let totalPrice = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((p) => p._id === items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalPrice += itemInfo.price * cartItems[items][item];
        }
      }
    }
    return totalPrice;
  }

  // -------------------------
  // Get User Data
  // -------------------------
  async function fetchUser() {
    try {
      const res = await axios.get(backend + '/api/user/me', {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch {
      setUser(null);
    }
  }

  // -------------------------
  // INITIAL LOAD
  // -------------------------
  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchUser();
  }, []);

  const value = {
    currency,
    backend,
    products,
    user,
    setUser,
    filterProducts,
    setFilterProducts,
    showSearchbar,
    setShowSearchbar,
    addToCart,
    cartItems,
    setCartItems,
    updateCart,
    clearCart, // NEW: Export clearCart function
    getCartQuantity,
    getCartToTalPrice,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export default ShopContextProvider;
