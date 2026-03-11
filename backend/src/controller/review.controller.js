const Review = require("../model/review.model");

//
// ADD REVIEW
//
exports.addReview = async (req, res, next) => {
  try {
    const { productId, rating, text } = req.body;

    if (!rating || !text)
      return res.status(400).json({ message: "Rating & text are required" });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.fullName,
      rating,
      text,
      date: new Date(),
      replies: []
    });

    res.json({
      message: "Review added",
      review
    });
  } catch (err) {
    next(err);
  }
};

//
// DELETE REVIEW
//
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only owner or admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this review" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
};

//
// GET ALL REVIEWS FOR A PRODUCT
//
exports.getReviews = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.find({ product: productId })
      .sort({ date: -1 })
      .populate("user", "fullName");

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

//
// ADD REPLY — ONLY ADMIN
//
exports.addReply = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;

    if (!text)
      return res.status(400).json({ message: "Reply text is required" });

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only admin can reply
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can reply" });
    }

    review.replies.push({
      user: req.user._id,
      text,
      createdAt: new Date()
    });

    await review.save();

    res.json({ message: "Reply added", review });
  } catch (err) {
    next(err);
  }
};
