import productModel from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import { createHash } from 'crypto';
import { unlink } from 'fs/promises';

const imageCache = new Map();
const CACHE_TTL = 3600000;
const CACHE_MAX_SIZE = 100;

function clearCache() {
  if (imageCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = imageCache.keys().next().value;
    imageCache.delete(oldestKey);
  }
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIN_FILE_SIZE = 10 * 1024;

function validateFile(file) {
  if (!file) return { valid: false, error: 'No file was provided' };

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
    return { valid: false, error: 'Only jpeg, jpg, png and webp are accepted' };

  if (file.size > MAX_FILE_SIZE)
    return {
      valid: false,
      error: 'File has exceeded the maximum acceptable size:5MB',
    };

  if (file.size < MIN_FILE_SIZE)
    return { valid: false, error: 'File has exceeded the minimum file size' };

  return { valid: true };
}

async function optimizeImages(imagePath, quality = 85) {
  const startTime = Date.now();

  const cacheKey = createHash('md5')
    .update(imagePath + quality)
    .digest('hex');

  if (imageCache.has(cacheKey)) {
    const cache = imageCache.get(cacheKey);
    if (Date.now() - cache.timestamp < CACHE_TTL) {
      console.log(
        `✅Cache hit for ${imagePath} in ${Date.now() - startTime}ms`
      );
      return cache.buffer;
    }
    imageCache.delete(cacheKey);
  }

  try {
    const buffer = await sharp(imagePath)
      .resize(1000, 1000, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort: 4,
      })
      .toBuffer();

    clearCache();
    imageCache.set(cacheKey, { buffer, timestamp: Date.now() });
    console.log(`✅Optimized ${imagePath} in ${Date.now() - startTime}ms`);
    return buffer;
  } catch (error) {
    console.error(`❌There was an error optimizing images:${error.message}`);
    throw error;
  }
}

async function uploadToCloudinary(buffer, filename, retries = 3) {
  for (let attempts = 1; attempts <= retries; attempts++) {
    try {
      const startTime = Date.now();
      const result = await cloudinary.uploader.upload(
        `data:image/webp;base64,${buffer.toString('base64')}`,
        {
          folder: 'Darkahs_product_images_folder',
          public_id: `${filename}`,
          quality: 'auto:eco',
          fetch_format: 'auto',
          flags: 'progressive:steep',
          dpr: 'auto',
        }
      );
      console.log(
        `✅Uploaded ${filename} in ${
          Date.now() - startTime
        }ms in attempts:${attempts}`
      );
      return result.secure_url;
    } catch (error) {
      console.error(
        `❌There was an error uploading image to cloudinary:${error.message}`
      );

      if (attempts === retries)
        throw new Error('Exceeded number of maximum retries');

      const waitTime = 2000 * attempts;
      console.log(`⏳Retrying uploading attempt:${attempts + 1}`);
      await new Promise((resolve) => {
        setTimeout(resolve, waitTime);
      });
    }
  }
}

async function processImages(files) {
  const images = [
    files.image1?.[0],
    files.image2?.[0],
    files.image3?.[0],
    files.image4?.[0],
  ].filter(Boolean);

  for (const img of images) {
    const validationResult = validateFile(img);
    if (!validationResult.valid) {
      throw new Error(validationResult.error);
    }
  }

  try {
    const urls = await Promise.all(
      images.map(async (image, idx) => {
        try {
          const optimizedImage = await optimizeImages(image.path);
          const filename = `product_${Date.now()}_${idx}`;
          const url = await uploadToCloudinary(optimizedImage, filename);
          await unlink(image.path).catch(() => {});
          return url;
        } catch (error) {
          console.error(
            `❌There was an error with processing images:${error.message}`
          );
          await unlink(image.path).catch(() => {});
          throw error;
        }
      })
    );
    return urls;
  } catch (error) {
    console.error(`❌There was error processing images:${error.message}`);
    await Promise.all(
      images.map(async (image) => {
        await unlink(image.path).catch(() => {});
      })
    );
    throw error;
  }
}

function validateInput(data) {
  const errors = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  } else if (data.name.length < 3) {
    errors.push('Name must be at least 3 characters');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  // description validation
  if (!data.desc || typeof data.desc !== 'string') {
    errors.push('Desc is required');
  } else if (data.desc.length < 50) {
    errors.push('Desc must be at least 50 characters long');
  } else if (data.desc.length > 10000) {
    errors.push('Desc must not be more than 10000 characters long');
  }

  // Price Validation
  const price = Number(data.price);
  if (isNaN(price) || price < 0) {
    errors.push('Price must be a positive number');
  } else if (price > 1000000) {
    errors.push('Price must be less than 1,000,000');
  }

  // Category Validation
  if (!data.category || typeof data.category !== 'string') {
    errors.push('Category is required');
  }

  // Subcategory Validation
  if (!data.subCategory || typeof data.subCategory !== 'string') {
    errors.push('Subcategory is required');
  }

  // sizes validation
  let parsedSizes;
  try {
    parsedSizes =
      typeof data.sizes === 'string' ? JSON.parse(data.sizes) : data.sizes;

    const validSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const invalidSizes = parsedSizes.filter((s) => !validSizes.includes(s));
    if (invalidSizes.length > 0) {
      errors.push(`Only XXS, XS, S, M, L, XL, XXL, XXXL are valid sizes`);
    }
  } catch (error) {
    errors.push('Sizes must be a valid array');
  }

  const bestseller = data.bestseller === true || data.bestseller === 'true';
  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      name: data.name?.trim(),
      desc: data.desc?.trim(),
      price: Number(price),
      category: data.category?.trim(),
      subCategory: data.subCategory?.trim(),
      sizes: parsedSizes,
      bestseller,
    },
  };
}

async function addProduct(req, res) {
  const startTime = Date.now();
  try {
    const validation = validateInput(req.body);
    if (!validation.valid)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors,
      });

    const imagesUrl = await processImages(req.files);

    const newProduct = new productModel({
      ...validation.sanitized,
      image: imagesUrl,
    });

    await newProduct.save();
    const duration = Date.now() - startTime;

    // No caching for POST requests (creates new data)
    return res.status(201).json({
      success: true,
      message: `${newProduct.name} was added successfully`,
      newProduct,
      processingTime: `${duration}ms`,
    });
  } catch (error) {
    console.error(`Error trying to add product:${error.message}`);
    if (error.message.includes('E11000')) {
      return res.status(409).json({
        success: false,
        message: 'Product with this name already exists',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to add product',
    });
  }
}

async function updateProduct(req, res) {
  const startTime = Date.now();
  try {
    const { id } = req.body;
    if (!id)
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });

    const product = await productModel.findById(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: 'No product was found',
      });

    const validation = validateInput({
      ...product.toObject(),
      ...req.body,
    });

    if (!validation.valid)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors,
      });

    const sanitized = validation.sanitized;

    if (req.body.name) product.name = sanitized.name;
    if (req.body.desc) product.desc = sanitized.desc;
    if (req.body.price) product.price = sanitized.price;
    if (req.body.category) product.category = sanitized.category;
    if (req.body.subCategory) product.subCategory = sanitized.subCategory;
    if (req.body.sizes) product.sizes = sanitized.sizes;
    if (req.body.bestseller !== undefined)
      product.bestseller = sanitized.bestseller;

    if (req.files && Object.keys(req.files).length > 0) {
      const newImages = await processImages(req.files);
      product.image = newImages;
    }

    await product.save();
    const duration = Date.now() - startTime;

    // No caching for PUT/PATCH requests (modifies data)
    return res.status(200).json({
      success: true,
      message: `${product.name} was updated successfully`,
      product,
      processingTime: `${duration}ms`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update Product',
    });
  }
}

async function removeProduct(req, res) {
  try {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct)
      return res.status(404).json({
        success: false,
        message: 'Cant delete Product Not found',
      });

    // No caching for DELETE requests
    return res.status(200).json({
      success: true,
      message: `${deletedProduct.name} deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete Product',
    });
  }
}

async function listProduct(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      productModel
        .find()
        .select(
          'name desc price image category subCategory sizes bestseller createdAt'
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      productModel.countDocuments(),
    ]);

    // Cache product list for 5 minutes (products don't change frequently)
    res.setHeader(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=60'
    );
    // Add ETag for conditional requests
    res.setHeader('ETag', `"products-${total}-${page}"`);

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        productsPerPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });

    const product = await productModel.findById(id).lean();

    if (!product)
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });

    // Cache individual product for 10 minutes (longer than list)
    res.setHeader(
      'Cache-Control',
      'public, max-age=600, stale-while-revalidate=120'
    );
    // Add ETag based on product's updatedAt or _id
    res.setHeader(
      'ETag',
      `"product-${product._id}-${product.updatedAt || product.createdAt}"`
    );

    return res.status(200).json({
      success: true,
      message: `${product.name} fetched successfully`,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
}

export { addProduct, updateProduct, removeProduct, listProduct, getProduct };
