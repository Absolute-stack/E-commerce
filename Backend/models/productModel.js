import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // ✅ Keep for text search
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      // ❌ Removed index - descriptions are rarely searched directly
    },
    price: {
      type: Number,
      required: true,
      min: 0, // ✅ Added validation
      // Index moved to compound index below
    },

    // ⚡ NEW: Separate thumbnail for fast loading
    thumbnail: {
      type: String,
      required: false,
      // This will store the optimized small image
    },

    // ⚡ RENAMED: 'image' → 'images' for clarity
    images: {
      type: [String], // Array of strings (more specific than 'Array')
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0; // At least one image required
        },
        message: 'At least one image is required',
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // ✅ Auto-lowercase for consistency
      // Index moved to compound indexes below
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    sizes: {
      type: [String], // More specific than 'Array'
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], // ✅ Validate sizes
    },
    bestseller: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true }, // ⚡ CRITICAL: Enable virtuals in JSON
    toObject: { virtuals: true }, // ⚡ CRITICAL: Enable virtuals in objects
  }
);

// ========================================
// ⚡ OPTIMIZED INDEXES (Removed wasteful ones)
// ========================================

// ❌ REMOVED: productSchema.index({ image: 1 });
//    Reason: You never query by image URL

// ❌ REMOVED: productSchema.index({ desc: 1 });
//    Reason: Descriptions aren't searched directly

// ✅ KEPT: Name index (for search)
// Already defined in schema above

// ✅ IMPROVED: Compound indexes for common queries
productSchema.index({ category: 1, price: 1 }); // "Men's shirts by price"
productSchema.index({ category: 1, bestseller: -1 }); // "Bestsellers in category"
productSchema.index({ category: 1, subCategory: 1 }); // "Men's casual wear"
productSchema.index({ bestseller: -1, createdAt: -1 }); // "Latest bestsellers"

// ✅ OPTIONAL: Full-text search on name and description
productSchema.index({ name: 'text', desc: 'text' });

// ========================================
// ⚡ VIRTUAL FIELD - THE MAGIC TRICK
// ========================================
// This creates a fake 'image' field that your frontend expects
// BUT it returns the optimized thumbnail first!

productSchema.virtual('image').get(function () {
  // Return array format your frontend already uses
  return [
    this.thumbnail || this.images[0], // First: small thumbnail (30KB)
    ...this.images.slice(1), // Rest: full images (not loaded yet)
  ];
});

// ========================================
// ⚡ OPTIMIZED QUERY HELPERS
// ========================================

// For product listing pages (homepage, category pages)
productSchema.statics.findForListing = function (filters = {}) {
  const query = {};

  // Build query from filters
  if (filters.category) query.category = filters.category.toLowerCase();
  if (filters.subCategory)
    query.subCategory = filters.subCategory.toLowerCase();
  if (filters.bestseller !== undefined) query.bestseller = filters.bestseller;
  if (filters.minPrice)
    query.price = { ...query.price, $gte: filters.minPrice };
  if (filters.maxPrice)
    query.price = { ...query.price, $lte: filters.maxPrice };

  return this.find(query)
    .select('name price thumbnail images bestseller') // Only needed fields
    .limit(filters.limit || 20)
    .skip(filters.skip || 0)
    .sort(filters.sort || { createdAt: -1 })
    .lean({ virtuals: true }); // ⚡ Fast + includes virtual 'image' field
};

// For product detail page (needs all data)
productSchema.statics.findByIdForDetail = function (productId) {
  return this.findById(productId).lean({ virtuals: true }); // Get everything + virtuals
};

// Get bestsellers
productSchema.statics.getBestsellers = function (limit = 10) {
  return this.find({ bestseller: true })
    .select('name price thumbnail images')
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean({ virtuals: true });
};

// Search products by name
productSchema.statics.searchProducts = function (searchTerm, limit = 20) {
  return this.find({ $text: { $search: searchTerm } })
    .select('name price thumbnail images category')
    .limit(limit)
    .lean({ virtuals: true });
};

// ========================================
// ⚡ PRE-SAVE HOOK - AUTO-SET THUMBNAIL
// ========================================

productSchema.pre('save', function (next) {
  // Auto-set thumbnail from first image if not provided
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }

  // Ensure categories are lowercase
  if (this.category) {
    this.category = this.category.toLowerCase().trim();
  }
  if (this.subCategory) {
    this.subCategory = this.subCategory.toLowerCase().trim();
  }

  next();
});

const productModel =
  mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
