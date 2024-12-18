const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// @route   POST api/reviews
// @desc    Create a review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existingReview) {
      return res.status(400).json({ msg: 'You have already reviewed this product' });
    }

    const newReview = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment
    });

    const review = await newReview.save();

    // Update product's reviews and recalculate average rating
    product.reviews.push(review._id);
    const reviews = await Review.find({ product: productId });
    const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    product.averageRating = parseFloat(averageRating.toFixed(1));

    await product.save();

    res.json(review);
  } catch (err) {
    console.error('Error in review submission:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message, stack: err.stack });
  }
});

// @route   GET api/reviews/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ product: req.params.productId });
    const totalPages = Math.ceil(totalReviews / limit);

    res.json({
      reviews,
      currentPage: page,
      totalPages,
      totalReviews
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;

