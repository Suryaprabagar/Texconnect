const User = require('../models/User');
const { generateTokens } = require('../services/auth.service');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed: User already exists -', email);
      return apiResponse(res, 400, false, 'User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: role || 'buyer',
    });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Save refresh token in user
    user.refreshTokens.push(refreshToken);
    await user.save();

    return apiResponse(res, 201, true, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    console.log('Login attempt for email:', email);
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      console.log('User not found:', email);
      return apiResponse(res, 401, false, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log('Password match result for', email, ':', isMatch);
    if (!isMatch) {
      return apiResponse(res, 401, false, 'Invalid credentials');
    }

    // Check account status
    if (user.status !== 'active') {
      console.log('Login blocked: Account status is', user.status, '-', email);
      return apiResponse(res, 401, false, `Your account is ${user.status}. Please contact support.`);
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    return apiResponse(res, 200, true, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return apiResponse(res, 200, true, 'User data fetched', { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout / clear refresh token
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    const token = req.body.refreshToken;
    const user = await User.findById(req.user._id);
    
    // Remove refresh token from array
    user.refreshTokens = user.refreshTokens.filter(t => t !== token);
    await user.save();

    return apiResponse(res, 200, true, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};
