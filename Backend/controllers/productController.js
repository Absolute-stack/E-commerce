import productModel from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';
async function listProduct(req, res) {
  try {
    const allProducts = await productModel.find({});
    return res.status(200).json({
      success: true,
      message: 'Fetched All Products',
      allProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
}
async function addProduct(req, res) {
  try {
    const {
      name,
      desc,
      price,
      category,
      subCategory,
      sizes,
      date,
      bestseller,
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );
    const newProduct = new productModel({
      name,
      desc,
      price,
      image: imagesUrl,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      date: Date.now(),
      bestseller: bestseller === true || bestseller === 'true' ? true : false,
    });

    await newProduct.save();

    return res.status(200).json({
      success: true,
      message: 'Product Successfully added',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
    });
  }
}
async function removeProduct(req, res) {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product Not Found',
      });
    }

    await productModel.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something Went Wrong. Please Try Again Later',
    });
  }
}
async function updateProduct(req, res) {
  try {
    const {
      id,
      name,
      desc,
      price,
      category,
      subCategory,
      sizes,
      date,
      bestseller,
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    const product = await productModel.findById(id);

    if (!product) return res.status(404).json({ success: false });

    if (name) product.name = name;
    if (desc) product.desc = desc;
    if (price) product.price = price;
    if (category) product.category = category;
    if (subCategory) product.subCategory = subCategory;
    if (sizes) {
      try {
        product.sizes = JSON.parse(sizes);
      } catch {
        product.sizes = sizes;
      }
    }
    if (bestseller !== undefined) product.bestseller = bestseller;
    if (images.length > 0) product.image = imagesUrl;

    await product.save();
    res.status(202).json({
      success: true,
      message: 'Product Updated Successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        'Something Went Wrong Product Couldnt be Updated Try Again Later.',
    });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({
        success: false,
        message: 'Couldnt Fetch Product Details',
      });

    const productData = await productModel.findById(id);
    return res.status(200).json({
      success: true,
      message: 'Product Detalis Retrieved',
      productData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
export { listProduct, addProduct, removeProduct, updateProduct, getProduct };
