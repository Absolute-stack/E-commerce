import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean, required: true },
  },
  { timestamps: true, versionKey: false }
);

productSchema.index({ image: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 1 });
productSchema.index({ desc: 1 });
const productModel =
  mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
