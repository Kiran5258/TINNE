const cloudinary = require("../config/cloudinary");
const { PRODUCT_CATEGORIES } = require("../constants/category.enum");
const Product = require("../model/product.model");

// =================================
//  CREATE PRODUCT (ADMIN ONLY)
// =================================
exports.createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      description,
      price,
      offerPrice,
      sizes,
      category,
      images
    } = req.body;

    // Validation
    if (!productName || !description || !price || !category || !sizes || sizes.length === 0 || !images || images.length === 0) {
      return next({ statusCode: 400, message: "All fields are required" });
    }

    // Admin check
    if (!req.user || req.user.role !== "admin") {
      return next({ statusCode: 403, message: "Admin only access" });
    }

    // Upload image to Cloudinary
    let uploadedImages = [];

    for (const img of images) {
      // Only upload if Base64 string
      if (img.startsWith("data:")) {
        const upload = await cloudinary.uploader.upload(img, {
          folder: "tinne_products",
        });
        uploadedImages.push(upload.secure_url);
      }
    }

    const product = await Product.create({
      productName,
      description,
      price,
      offerPrice,   // percentage discount
      sizes,        // size + stock objects
      category,
      images: uploadedImages,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (err) {
    next(err);
  }
};

// =============================
// GET CATEGORIES (STATIC ENUM)
// =============================
exports.getCategories = async (req, res, next) => {
  try {
    res.json(PRODUCT_CATEGORIES);
  } catch (err) {
    next(err);
  }
};

// =================================
//        GET PRODUCTS (FILTER)
// =================================
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      q,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    if (category) filter.category = category;

    if (q) {
      filter.$or = [
        { productName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_low: { price: 1 },
      price_high: { price: -1 },
    };

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
      products,
    });

  } catch (err) {
    next(err);
  }
};

// =================================
//        GET SINGLE PRODUCT
// =================================
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return next({ statusCode: 404, message: "Product not found" });

    res.json({ product });

  } catch (err) {
    next(err);
  }
};

// =============================
//       UPDATE PRODUCT
// =============================
exports.updateProduct = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return next({ statusCode: 403, message: "Admin only route" });
    }

    let updates = { ...req.body };
    console.log(updates);
    // FIX: sizes can be array or string
    if (updates.sizes) {
      if (typeof updates.sizes === "string") {
        updates.sizes = JSON.parse(updates.sizes);
      }
    }

    // FIX: Handle multiple images upload
    if (updates.images && Array.isArray(updates.images)) {
      let uploadedImages = [];
      const currentProduct = await Product.findById(req.params.id);

      // Keep existing images that are not base64 (already URLs)
      // OR if the frontend sends all images including old URLs
      for (const img of updates.images) {
        if (img.startsWith("data:")) {
          const upload = await cloudinary.uploader.upload(img, {
            folder: "tinne_products",
          });
          uploadedImages.push(upload.secure_url);
        } else {
          uploadedImages.push(img);
        }
      }
      updates.images = uploadedImages;
    }

    // Handle legacy single image update if present (optional fallback)
    if (updates.image && updates.image.startsWith("data:")) {
      const upload = await cloudinary.uploader.upload(updates.image, {
        folder: "tinne_products",
      });
      updates.image = upload.secure_url;
      // Also push to images array if not present? 
      // Ideally we should unify to use 'images' array only
    }


    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    console.log(updated);
    if (!updated) {
      return next({ statusCode: 404, message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updated,
    });

  } catch (err) {
    next(err);
  }
};



// =============================
//      DELETE PRODUCT
// =============================
exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted)
      return next({ statusCode: 404, message: "Product not found" });

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    next(err);
  }
};

// =============================
//     SEARCH PRODUCT
// =============================
exports.searchProduct = async (req, res, next) => {
  try {
    const q = req.query.query?.toLowerCase();

    if (!q)
      return res.json({ suggestions: [], products: [] });

    const products = await Product.find({
      productName: { $regex: q, $options: "i" }
    })
      .select("productName price image")
      .limit(5);

    res.json({ products });

  } catch (err) {
    next(err);
  }
};

