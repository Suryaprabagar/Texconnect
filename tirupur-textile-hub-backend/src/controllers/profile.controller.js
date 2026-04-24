const ManufacturerProfile = require('../models/ManufacturerProfile');
const BuyerProfile = require('../models/BuyerProfile');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Get all manufacturers
// @route   GET /api/v1/manufacturers
// @access  Public
exports.getManufacturers = async (req, res, next) => {
  try {
    const manufacturers = await ManufacturerProfile.find({ isVerified: true });
    return apiResponse(res, 200, true, 'Manufacturers fetched', { manufacturers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single manufacturer profile
// @route   GET /api/v1/manufacturers/:id
// @access  Public
exports.getManufacturerProfile = async (req, res, next) => {
  try {
    const profile = await ManufacturerProfile.findById(req.params.id).populate('userId', 'name email');
    if (!profile) return apiResponse(res, 404, false, 'Manufacturer not found');
    return apiResponse(res, 200, true, 'Manufacturer profile fetched', { profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Update manufacturer profile
// @route   POST /api/v1/manufacturers/profile
// @access  Private (Manufacturer)
exports.upsertManufacturerProfile = async (req, res, next) => {
  try {
    let profile = await ManufacturerProfile.findOne({ userId: req.user._id });

    if (profile) {
      profile = await ManufacturerProfile.findOneAndUpdate(
        { userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      profile = await ManufacturerProfile.create({
        ...req.body,
        userId: req.user._id
      });
    }

    return apiResponse(res, 200, true, 'Manufacturer profile updated', { profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's buyer profile
// @route   GET /api/v1/buyers/profile
// @access  Private (Buyer)
exports.getBuyerProfile = async (req, res, next) => {
  try {
    const profile = await BuyerProfile.findOne({ userId: req.user._id });
    if (!profile) return apiResponse(res, 404, false, 'Buyer profile not found');
    return apiResponse(res, 200, true, 'Buyer profile fetched', { profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Update buyer profile
// @route   POST /api/v1/buyers/profile
// @access  Private (Buyer)
exports.upsertBuyerProfile = async (req, res, next) => {
  try {
    let profile = await BuyerProfile.findOne({ userId: req.user._id });

    if (profile) {
      profile = await BuyerProfile.findOneAndUpdate(
        { userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      profile = await BuyerProfile.create({
        ...req.body,
        userId: req.user._id
      });
    }

    return apiResponse(res, 200, true, 'Buyer profile updated', { profile });
  } catch (error) {
    next(error);
  }
};
