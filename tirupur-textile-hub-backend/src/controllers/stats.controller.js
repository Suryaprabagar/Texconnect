const User = require('../models/User');
const Product = require('../models/Product');
const RFQ = require('../models/RFQ');
const ManufacturerProfile = require('../models/ManufacturerProfile');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Get global statistics for homepage
// @route   GET /api/v1/stats/summary
// @access  Public
exports.getGlobalStats = async (req, res, next) => {
  try {
    const [
      supplierCount,
      productCount,
      rfqCount,
      categoryStats
    ] = await Promise.all([
      User.countDocuments({ role: 'manufacturer' }),
      Product.countDocuments({ status: 'active' }),
      RFQ.countDocuments({ status: 'open' }),
      Product.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    // Format category stats into a more usable object
    const categories = categoryStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return apiResponse(res, 200, true, 'Statistics fetched successfully', {
      suppliers: supplierCount,
      products: productCount,
      rfqs: rfqCount,
      categories
    });
  } catch (error) {
    next(error);
  }
};
