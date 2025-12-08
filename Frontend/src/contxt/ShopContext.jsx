import { createContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ShopContext = createContext();

// Move static values outside component
const CURRENCY = 'GH₵';

function ShopContextProvider({ children }) {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [showSearchbar, setShowSearchbar] = useState(false);

  // -------------------------
  // FETCH PRODUCTS
  // -------------------------
  const fetchProducts = useCallback(
    async function fetchProducts() {
      try {
        const res = await axios.get(`${backend}/api/product/list`, {
          withCredentials: true,
        });

        // Fixed: Changed from allProducts to products
        const allProducts = res.data?.products || [];

        console.log('Products fetched:', allProducts.length); // Debug log

        setProducts(allProducts);
        setFilterProducts(structuredClone(allProducts));
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Something went wrong. Please refresh the page.');
      }
    },
    [backend]
  );

  // -------------------------
  // FETCH CART FROM BACKEND
  // -------------------------
  const fetchCart = useCallback(
    async function fetchCart() {
      try {
        const res = await axios.post(
          `${backend}/api/cart/get`,
          {},
          { withCredentials: true }
        );

        setCartItems(res.data.cartData || {});
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    },
    [backend]
  );

  // -------------------------
  // FETCH USER DATA
  // -------------------------
  const fetchUser = useCallback(
    async function fetchUser() {
      try {
        const res = await axios.get(`${backend}/api/user/me`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    },
    [backend]
  );

  // -------------------------
  // ADD TO CART
  // -------------------------
  const addToCart = useCallback(
    async function addToCart(itemId, size) {
      if (!size) {
        toast.error('Please Select A Size');
        return;
      }

      try {
        const res = await axios.post(
          `${backend}/api/cart/add`,
          { itemId, size },
          { withCredentials: true }
        );

        setCartItems(res.data.cartData);
        toast.success('Item added to cart');
      } catch (error) {
        console.error('Failed to add to cart:', error);
        toast.error('Failed to add item. Please Login and Try Again');
      }
    },
    [backend]
  );

  // -------------------------
  // UPDATE CART
  // -------------------------
  const updateCart = useCallback(
    async function updateCart(itemId, size, quantity) {
      try {
        const res = await axios.post(
          `${backend}/api/cart/update`,
          { itemId, size, quantity },
          { withCredentials: true }
        );

        setCartItems(res.data.cartData);
      } catch (error) {
        console.error('Failed to update cart:', error);
        toast.error('Failed to update cart. Please Login and Try Again');
      }
    },
    [backend]
  );

  // -------------------------
  // CLEAR CART
  // -------------------------
  const clearCart = useCallback(
    async function clearCart() {
      try {
        const res = await axios.post(
          `${backend}/api/cart/clear`,
          {},
          { withCredentials: true }
        );

        if (res.data.success) {
          setCartItems({});
          console.log('Cart cleared successfully');
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
        // Clear frontend cart even if backend fails
        setCartItems({});
      }
    },
    [backend]
  );

  // -------------------------
  // GET TOTAL CART QUANTITY
  // -------------------------
  function getCartQuantity() {
    let cartQuantity = 0;

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        cartQuantity += cartItems[itemId][size];
      }
    }

    return cartQuantity;
  }

  // -------------------------
  // GET CART TOTAL PRICE
  // -------------------------
  function getCartToTalPrice() {
    let totalPrice = 0;

    for (const itemId in cartItems) {
      const itemInfo = products.find((p) => p._id === itemId);
      if (!itemInfo) continue;

      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) {
          totalPrice += itemInfo.price * quantity;
        }
      }
    }

    return totalPrice;
  }

  // -------------------------
  // INITIAL LOAD
  // -------------------------
  useEffect(
    function initialLoad() {
      fetchProducts();
      fetchCart();
      fetchUser();
    },
    [fetchProducts, fetchCart, fetchUser]
  );

  const value = {
    currency: CURRENCY,
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
    clearCart,
    getCartQuantity,
    getCartToTalPrice,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export default ShopContextProvider;
