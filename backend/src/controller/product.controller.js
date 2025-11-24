const cloudinary = require("../config/cloudinary");
const Product = require("../model/product.model");

// =============================
//   CREATE PRODUCT (ADMIN ONLY)
// =============================
exports.createProduct = async (req, res, next) => {
  try {
    const { productName, description, price, offerPrice, size, category, image,stocks } = req.body;

    // Validation
    if (!productName || !description || !price || !category || !size || !image ||!stocks) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    // Admin check
    if (!req.user || !req.user.isAdmin) {
      const error = new Error("Admin only route");
      error.statusCode = 403;
      return next(error);
    }

    // Upload direct base64 image to Cloudinary
    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "tinne_products",
    });

    const product = await Product.create({
      name: productName,  // <-- saved as "name"
      description,
      price,
      offerPrice,
      size,
      category,
      image: uploaded.secure_url,
      stocks,
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
//     GET PRODUCTS (FILTER)
// =============================
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

    // category
    if (category) filter.category = category;

    // search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // sorting
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


// =============================
//       GET SINGLE PRODUCT
// =============================
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id); 
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      message: "success",
      product,
    });

  } catch (err) {
    next(err);
  }
};


// =============================
//       UPDATE PRODUCT
// =============================
exports.updateProduct = async (req, res, next) => {
  try {
    const { image } = req.body;
    let updatedData = { ...req.body };

    // Admin check
    if (!req.user || !req.user.isAdmin) {
      const error = new Error("Admin only route");
      error.statusCode = 403;
      return next(error);
    }

    // If new image (base64), upload to Cloudinary
    if (image && image.startsWith("data:image")) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "tinne_products",
      });
      updatedData.image = uploaded.secure_url;
    }

    // If image is NOT base64 and is empty → remove image update
    if (image === undefined || image === null || image === "") {
      delete updatedData.image;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
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
    if (!req.user || !req.user.isAdmin) {
      const err = new Error("Admin only route");
      err.statusCode = 403;
      return next(err);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    next(err);
  }
};

exports.searchproduct=async (req, res) => {
  const q = req.query.query?.toLowerCase();

  if (!q) return res.json({ suggestions: [], products: [] });

  const suggestions = await Category.find({ name: { $regex: q, $options: "i" } })
    .limit(5);

  const products = await Product.find({
    name: { $regex: q, $options: "i" }
  })
    .select("name price image")
    .limit(5);

  res.json({
    suggestions: suggestions.map((s) => s.name),
    products,
  });
}
