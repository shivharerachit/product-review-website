const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();




const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://product-review-website-gold.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

const corsOptions = {
  origin: 'https://product-review-website-gold.vercel.app', // Allow requests only from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],     // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],       // Allowed request headers
  credentials: true,                                       // Allow cookies
};

// const corsOptions = {
//   origin: 'https://product-review-website-gold.vercel.app', // Allow only your frontend origin
//   methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
//   allowedHeaders: 'Content-Type,Authorization', // Allowed headers
// };

app.use(cors(corsOptions));

// Middleware
// app.use(cors(
//   {
//     origin: ["https://product-review-website-gold.vercel.app"],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
//   }
// ));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/reviews', require('./routes/reviews'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

