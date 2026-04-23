const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tirupur Textile Hub API' });
});

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes.js'));
app.use('/api/v1/products', require('./routes/products.routes.js'));
app.use('/api/v1/manufacturers', require('./routes/manufacturer.routes.js'));
app.use('/api/v1/buyers', require('./routes/buyer.routes.js'));
app.use('/api/v1/rfqs', require('./routes/rfq.routes.js'));
app.use('/api/v1/quotes', require('./routes/quote.routes.js'));
app.use('/api/v1/messages', require('./routes/messages.routes.js'));
app.use('/api/v1/orders', require('./routes/orders.routes.js'));
app.use('/api/v1/stats', require('./routes/stats.routes.js'));


const errorHandler = require('./middleware/errorHandler');

// ... other middlewares
app.use(errorHandler);

module.exports = app;
