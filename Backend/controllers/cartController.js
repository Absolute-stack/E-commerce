import userModel from '../models/userModel.js';

// ADD TO CART
async function addToCart(req, res) {
  try {
    const userId = req.userId; // You already set this in userAuth
    const { itemId, size } = req.body;

    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and size are required',
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const cartData = userData.cartData;

    // Add to cart logic
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cartData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

// UPDATE CART QUANTITY
async function updateCart(req, res) {
  try {
    const userId = req.userId;
    const { itemId, size, quantity } = req.body;

    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item ID, size, and quantity are required',
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const cartData = userData.cartData;

    if (!cartData[itemId] || !cartData[itemId][size]) {
      return res.status(400).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      cartData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

// GET CART
async function getCart(req, res) {
  try {
    const userId = req.userId; // from middleware

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      cartData: userData.cartData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

// Add this function to your existing cartController.js

// CLEAR CART (NEW FUNCTION)
async function clearCart(req, res) {
  try {
    const userId = req.userId; // From auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Find user and clear their cart
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Clear the cart
    userData.cartData = {};
    await userData.save();

    console.log(`Cart cleared for user: ${userId}`);

    return res.json({
      success: true,
      message: 'Cart cleared successfully',
      cartData: {},
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message,
    });
  }
}

// Export it with your other functions
export { addToCart, updateCart, getCart, clearCart };
