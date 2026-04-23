const Product = require('../models/Product');
const ManufacturerProfile = require('../models/ManufacturerProfile');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Get all products (with search & filter)
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      q, category, fabricType, minGSM, maxGSM, minPrice, maxPrice,
      minMOQ, maxMOQ, sizes, page = 1, limit = 20, sortBy = 'createdAt'
    } = req.query;

    const filter = { status: 'active' };

    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (fabricType) filter.fabricType = new RegExp(fabricType, 'i');
    if (minGSM || maxGSM) filter.gsm = { ...(minGSM && { $gte: +minGSM }), ...(maxGSM && { $lte: +maxGSM }) };
    if (minPrice || maxPrice) filter.pricePerUnit = { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) };
    if (minMOQ || maxMOQ) filter.moq = { ...(minMOQ && { $gte: +minMOQ }), ...(maxMOQ && { $lte: +maxMOQ }) };
    if (sizes) filter.availableSizes = { $in: sizes.split(',') };

    const sort = sortBy === 'price_asc' ? { pricePerUnit: 1 }
      : sortBy === 'price_desc' ? { pricePerUnit: -1 }
      : sortBy === 'popular' ? { views: -1 }
      : { createdAt: -1 };

    const skip = (+page - 1) * +limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate({ path: 'manufacturerId', select: 'companyName isVerified verificationBadge logoUrl rating' })
        .sort(sort)
        .skip(skip)
        .limit(+limit),
      Product.countDocuments(filter)
    ]);

    return apiResponse(res, 200, true, 'Products fetched', {
      products,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('manufacturerId');
    if (!product) {
      return apiResponse(res, 404, false, 'Product not found');
    }
    return apiResponse(res, 200, true, 'Product details fetched', { product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private (Manufacturer)
exports.createProduct = async (req, res, next) => {
  try {
    const manufacturerProfile = await ManufacturerProfile.findOne({ userId: req.user.id });
    if (!manufacturerProfile) {
      return apiResponse(res, 400, false, 'Complete manufacturer profile first');
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path); // Cloudinary storage provides 'path' as the URL
    }

    const product = await Product.create({
      ...req.body,
      images: imageUrls.length > 0 ? imageUrls : req.body.images,
      status: 'active', // Set to active by default so it shows in the list
      userId: req.user.id,
      manufacturerId: manufacturerProfile._id
    });

    return apiResponse(res, 201, true, 'Product created successfully', { product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Owner)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return apiResponse(res, 404, false, 'Product not found');

    // Check ownership
    if (product.userId.toString() !== req.user.id) {
      return apiResponse(res, 403, false, 'Not authorized to update this product');
    }

    let updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      // Logic: if images are uploaded, we replace or append? 
      // Let's replace for now or handle via client. 
      // If client sends 'images' as a JSON string of existing ones, we could merge.
      updateData.images = newImages;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return apiResponse(res, 200, true, 'Product updated', { product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Owner)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return apiResponse(res, 404, false, 'Product not found');

    if (product.userId.toString() !== req.user.id) {
      return apiResponse(res, 403, false, 'Not authorized to delete this product');
    }

    await product.deleteOne();
    return apiResponse(res, 200, true, 'Product deleted');
  } catch (error) {
    next(error);
  }
};
