const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   POST api/products
// @desc    Create a product
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      user: req.user.id
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort(sort ? { [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1 } : { createdAt: -1 })
      .populate('user', 'username');

    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'username')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'username' }
      });

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Make sure user owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Make sure user owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await product.remove();

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;

