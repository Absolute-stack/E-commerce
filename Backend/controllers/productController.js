import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// ========================================
// LIST ALL PRODUCTS
// ========================================
async function listProduct(req, res) {
  try {
    const allProducts = await productModel
      .find({})
      .select('-__v') // Exclude version key
      .lean(); // Convert to plain JavaScript objects (faster)

    return res.status(200).json({
      success: true,
      message: 'Fetched all products successfully',
      count: allProducts.length,
      allProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products. Please try again later.',
    });
  }
}

// ========================================
// GET SINGLE PRODUCT
// ========================================
async function getProduct(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const productData = await productModel.findById(id).select('-__v').lean();

    if (!productData) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product details retrieved successfully',
      productData,
    });
  } catch (error) {
    console.error('Error fetching product:', error);

    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// ========================================
// ADD NEW PRODUCT
// ========================================
async function addProduct(req, res) {
  try {
    const { name, desc, price, category, subCategory, sizes, bestseller } =
      req.body;

    // Validation
    if (!name || !desc || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, desc, price, category',
      });
    }

    // Collect uploaded images
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required',
      });
    }

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
          folder: 'products', // Organize in Cloudinary
          transformation: [
            { width: 800, height: 1000, crop: 'limit' }, // Optimize size
            { quality: 'auto' }, // Auto quality
            { fetch_format: 'auto' }, // Auto format (WebP when supported)
          ],
        });
        return result.secure_url;
      })
    );

    // Parse sizes
    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
    } catch {
      parsedSizes = sizes;
    }

    // Create new product
    const newProduct = new productModel({
      name,
      desc,
      price: Number(price),
      image: imagesUrl,
      category,
      subCategory,
      sizes: parsedSizes,
      bestseller: bestseller === true || bestseller === 'true',
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to add product. Please try again.',
    });
  }
}

// ========================================
// UPDATE PRODUCT
// ========================================
async function updateProduct(req, res) {
  try {
    const { id, name, desc, price, category, subCategory, sizes, bestseller } =
      req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Find product
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Handle image uploads if provided
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length > 0) {
      // Upload new images
      const imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: 'image',
            folder: 'products',
            transformation: [
              { width: 800, height: 1000, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          });
          return result.secure_url;
        })
      );
      product.image = imagesUrl;
    }

    // Update fields if provided
    if (name !== undefined) product.name = name;
    if (desc !== undefined) product.desc = desc;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (bestseller !== undefined) {
      product.bestseller = bestseller === true || bestseller === 'true';
    }

    if (sizes !== undefined) {
      try {
        product.sizes = JSON.parse(sizes);
      } catch {
        product.sizes = sizes;
      }
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Error updating product:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update product. Please try again.',
    });
  }
}

// ========================================
// DELETE PRODUCT
// ========================================
async function removeProduct(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Find and delete in one operation
    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: {
        id: product._id,
        name: product.name,
      },
    });
  } catch (error) {
    console.error('Error deleting product:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to delete product. Please try again.',
    });
  }
}

export { listProduct, getProduct, addProduct, updateProduct, removeProduct };
