# TirupurTextileHub — B2B Garment Marketplace Platform
## Complete Architecture & Engineering Blueprint

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│   React + TailwindCSS SPA (Vercel / Netlify CDN)                    │
│   • Buyer Portal  • Manufacturer Portal  • Admin Dashboard          │
└───────────────────────┬─────────────────────────────────────────────┘
                        │ HTTPS / REST API
┌───────────────────────▼─────────────────────────────────────────────┐
│                       API GATEWAY LAYER                              │
│   Nginx Reverse Proxy → Node.js + Express REST API                  │
│   • Rate Limiting  • JWT Validation  • Request Logging              │
└──────┬──────────────┬─────────────────┬────────────────┬────────────┘
       │              │                 │                │
┌──────▼───┐  ┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────────┐
│  Auth    │  │  Products    │  │  RFQ/Quote  │  │  Messaging     │
│  Service │  │  Service     │  │  Service    │  │  Service       │
└──────┬───┘  └───────┬──────┘  └──────┬──────┘  └─────┬──────────┘
       │              │                │                │
┌──────▼──────────────▼────────────────▼────────────────▼────────────┐
│                      DATA LAYER                                      │
│   MongoDB Atlas (Primary)    Redis (Sessions/Cache)                 │
│   Cloudinary (Images)        AWS S3 (Documents)                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. MONGODB DATABASE SCHEMA

### Collection: users
```json
{
  "_id": "ObjectId",
  "email": "string (unique, indexed)",
  "passwordHash": "string",
  "role": "enum: ['buyer', 'manufacturer', 'admin']",
  "name": "string",
  "phone": "string",
  "isEmailVerified": "boolean",
  "isPhoneVerified": "boolean",
  "profileComplete": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastLogin": "Date",
  "status": "enum: ['active', 'suspended', 'pending']",
  "refreshTokens": ["string"]
}
```

### Collection: manufacturer_profiles
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "companyName": "string",
  "registrationNumber": "string",
  "gstin": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "country": "string (default: India)"
  },
  "yearEstablished": "number",
  "employeeCount": "string (range)",
  "productionCapacity": "string (units/month)",
  "specializations": ["string"],
  "certifications": ["string"],
  "exportExperience": "boolean",
  "exportCountries": ["string"],
  "factoryImages": ["string (Cloudinary URLs)"],
  "logoUrl": "string",
  "website": "string",
  "description": "string",
  "isVerified": "boolean",
  "verificationBadge": "enum: ['none', 'basic', 'premium']",
  "verificationDate": "Date",
  "rating": "number (1-5)",
  "reviewCount": "number",
  "totalOrders": "number",
  "responseRate": "number (percentage)",
  "avgResponseTime": "number (hours)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: buyer_profiles
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "companyName": "string",
  "buyerType": "enum: ['retailer', 'wholesaler', 'exporter', 'brand', 'individual']",
  "gstin": "string",
  "address": { "street": "string", "city": "string", "state": "string", "pincode": "string", "country": "string" },
  "preferredCategories": ["string"],
  "annualPurchaseVolume": "string",
  "logoUrl": "string",
  "website": "string",
  "isVerified": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: products
```json
{
  "_id": "ObjectId",
  "manufacturerId": "ObjectId (ref: manufacturer_profiles)",
  "userId": "ObjectId (ref: users)",
  "name": "string",
  "slug": "string (unique, indexed)",
  "category": "enum: ['tshirt', 'hoodie', 'kidswear', 'polo', 'formal', 'sportswear', 'innerwear', 'ethnic', 'denim', 'jacket', 'other']",
  "subCategory": "string",
  "description": "string",
  "fabricType": "string",
  "fabricComposition": "string (e.g. 100% Cotton, 60/40 Cotton-Polyester)",
  "gsm": "number",
  "availableSizes": ["enum: XS, S, M, L, XL, XXL, XXXL, Custom"],
  "colors": ["string"],
  "moq": "number (minimum order quantity)",
  "pricePerUnit": "number",
  "currency": "string (default: INR)",
  "priceBrackets": [
    { "minQty": "number", "maxQty": "number", "pricePerUnit": "number" }
  ],
  "leadTime": "number (days)",
  "customizationAvailable": "boolean",
  "customizationOptions": ["string"],
  "images": ["string (Cloudinary URLs)"],
  "tags": ["string"],
  "sku": "string",
  "weight": "number (grams per piece)",
  "packagingDetails": "string",
  "sampleAvailable": "boolean",
  "sampleCost": "number",
  "status": "enum: ['active', 'inactive', 'out_of_stock', 'draft']",
  "views": "number",
  "inquiryCount": "number",
  "isFeatured": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: rfqs (Request for Quotation)
```json
{
  "_id": "ObjectId",
  "rfqNumber": "string (auto-generated, unique)",
  "buyerId": "ObjectId (ref: users)",
  "buyerProfileId": "ObjectId (ref: buyer_profiles)",
  "productId": "ObjectId (ref: products, optional)",
  "manufacturerId": "ObjectId (ref: manufacturer_profiles, optional)",
  "title": "string",
  "category": "string",
  "description": "string",
  "requiredQuantity": "number",
  "targetPricePerUnit": "number",
  "currency": "string",
  "requiredSizes": ["string"],
  "requiredColors": ["string"],
  "fabricPreferences": "string",
  "gsmRequirement": "number",
  "customizationNeeded": "boolean",
  "customizationDetails": "string",
  "sampleRequired": "boolean",
  "deliveryDeadline": "Date",
  "deliveryAddress": "string",
  "attachments": ["string (URLs)"],
  "status": "enum: ['open', 'quoted', 'accepted', 'rejected', 'expired', 'closed']",
  "expiryDate": "Date",
  "quoteCount": "number",
  "selectedQuoteId": "ObjectId (ref: quotes)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: quotes
```json
{
  "_id": "ObjectId",
  "rfqId": "ObjectId (ref: rfqs)",
  "manufacturerId": "ObjectId (ref: users)",
  "manufacturerProfileId": "ObjectId (ref: manufacturer_profiles)",
  "buyerId": "ObjectId (ref: users)",
  "pricePerUnit": "number",
  "totalAmount": "number",
  "currency": "string",
  "quantity": "number",
  "leadTime": "number (days)",
  "sampleCost": "number",
  "fabricDetails": "string",
  "productionCapability": "string",
  "validUntil": "Date",
  "termsAndConditions": "string",
  "attachments": ["string"],
  "message": "string",
  "status": "enum: ['pending', 'viewed', 'accepted', 'rejected', 'expired']",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: conversations
```json
{
  "_id": "ObjectId",
  "participants": ["ObjectId (ref: users)"],
  "rfqId": "ObjectId (optional)",
  "productId": "ObjectId (optional)",
  "subject": "string",
  "lastMessage": "string",
  "lastMessageAt": "Date",
  "unreadCount": { "userId1": "number", "userId2": "number" },
  "status": "enum: ['active', 'archived']",
  "createdAt": "Date"
}
```

### Collection: messages
```json
{
  "_id": "ObjectId",
  "conversationId": "ObjectId (ref: conversations)",
  "senderId": "ObjectId (ref: users)",
  "content": "string",
  "attachments": ["string (URLs)"],
  "type": "enum: ['text', 'image', 'document', 'quote_card']",
  "metadata": "object (for quote_card: rfqId, quoteId)",
  "isRead": "boolean",
  "readAt": "Date",
  "createdAt": "Date"
}
```

### Collection: orders
```json
{
  "_id": "ObjectId",
  "orderNumber": "string (unique)",
  "buyerId": "ObjectId (ref: users)",
  "manufacturerId": "ObjectId (ref: users)",
  "rfqId": "ObjectId (ref: rfqs)",
  "quoteId": "ObjectId (ref: quotes)",
  "productId": "ObjectId (ref: products)",
  "quantity": "number",
  "pricePerUnit": "number",
  "totalAmount": "number",
  "currency": "string",
  "status": "enum: ['confirmed', 'in_production', 'quality_check', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'disputed']",
  "timeline": [
    { "status": "string", "timestamp": "Date", "note": "string", "updatedBy": "ObjectId" }
  ],
  "deliveryAddress": { "street": "string", "city": "string", "state": "string", "pincode": "string" },
  "expectedDelivery": "Date",
  "actualDelivery": "Date",
  "trackingNumber": "string",
  "paymentStatus": "enum: ['pending', 'partial', 'paid', 'refunded']",
  "paymentTerms": "string",
  "notes": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: reviews
```json
{
  "_id": "ObjectId",
  "orderId": "ObjectId (ref: orders)",
  "reviewerId": "ObjectId (ref: users)",
  "revieweeId": "ObjectId (ref: users)",
  "rating": "number (1-5)",
  "title": "string",
  "comment": "string",
  "qualityRating": "number",
  "communicationRating": "number",
  "deliveryRating": "number",
  "isVerified": "boolean",
  "createdAt": "Date"
}
```

---

## 3. BACKEND FOLDER STRUCTURE

```
tirupur-textile-hub-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── redis.js             # Redis connection
│   │   ├── cloudinary.js        # Cloudinary setup
│   │   └── constants.js         # App constants & enums
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   ├── roleCheck.js         # Role-based access control
│   │   ├── rateLimiter.js       # Express rate limiter
│   │   ├── upload.js            # Multer + Cloudinary upload
│   │   ├── validate.js          # Joi request validation
│   │   ├── errorHandler.js      # Global error handler
│   │   └── logger.js            # Morgan + Winston logger
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── ManufacturerProfile.js
│   │   ├── BuyerProfile.js
│   │   ├── Product.js
│   │   ├── RFQ.js
│   │   ├── Quote.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   ├── Order.js
│   │   └── Review.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── manufacturer.routes.js
│   │   ├── buyer.routes.js
│   │   ├── products.routes.js
│   │   ├── rfq.routes.js
│   │   ├── quotes.routes.js
│   │   ├── messages.routes.js
│   │   ├── orders.routes.js
│   │   └── admin.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── manufacturer.controller.js
│   │   ├── buyer.controller.js
│   │   ├── products.controller.js
│   │   ├── rfq.controller.js
│   │   ├── quotes.controller.js
│   │   ├── messages.controller.js
│   │   ├── orders.controller.js
│   │   └── admin.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js      # JWT generation, refresh tokens
│   │   ├── email.service.js     # Nodemailer / SendGrid
│   │   ├── sms.service.js       # Twilio / AWS SNS
│   │   ├── upload.service.js    # Cloudinary operations
│   │   ├── search.service.js    # Product search logic
│   │   └── notification.service.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── product.validator.js
│   │   ├── rfq.validator.js
│   │   └── profile.validator.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js       # Standardized API responses
│   │   ├── generateRFQNumber.js
│   │   ├── generateOrderNumber.js
│   │   ├── slugify.js
│   │   └── pagination.js
│   │
│   └── app.js                   # Express app setup
│
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .env.example
├── package.json
└── server.js                    # Entry point
```

---

## 4. FRONTEND FOLDER STRUCTURE

```
tirupur-textile-hub-frontend/
├── public/
│   └── assets/
├── src/
│   ├── api/
│   │   ├── axios.js             # Axios instance with interceptors
│   │   ├── auth.api.js
│   │   ├── products.api.js
│   │   ├── rfq.api.js
│   │   ├── messages.api.js
│   │   └── orders.api.js
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   └── ProductImageGallery.jsx
│   │   ├── rfq/
│   │   │   ├── RFQCard.jsx
│   │   │   ├── RFQForm.jsx
│   │   │   └── QuoteCard.jsx
│   │   ├── messaging/
│   │   │   ├── ConversationList.jsx
│   │   │   ├── MessageThread.jsx
│   │   │   └── MessageInput.jsx
│   │   └── manufacturer/
│   │       ├── FactoryCard.jsx
│   │       ├── VerificationBadge.jsx
│   │       └── FactoryProfile.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ManufacturerListPage.jsx
│   │   │   └── ManufacturerDetailPage.jsx
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   ├── buyer/
│   │   │   ├── BuyerDashboard.jsx
│   │   │   ├── MyRFQsPage.jsx
│   │   │   ├── CreateRFQPage.jsx
│   │   │   └── OrdersPage.jsx
│   │   ├── manufacturer/
│   │   │   ├── ManufacturerDashboard.jsx
│   │   │   ├── ManageProductsPage.jsx
│   │   │   ├── AddProductPage.jsx
│   │   │   ├── IncomingRFQsPage.jsx
│   │   │   └── ProfileSetupPage.jsx
│   │   ├── shared/
│   │   │   ├── MessagesPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SettingsPage.jsx
│   │   └── admin/
│   │       └── AdminDashboard.jsx
│   │
│   ├── store/                   # Zustand or Redux Toolkit
│   │   ├── authStore.js
│   │   ├── productStore.js
│   │   └── notificationStore.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProducts.js
│   │   ├── useRFQ.js
│   │   └── useMessages.js
│   │
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 5. REST API ENDPOINTS

### Auth Routes — /api/v1/auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register new user |
| POST | /login | Login with email + password |
| POST | /logout | Invalidate refresh token |
| POST | /refresh-token | Get new access token |
| POST | /forgot-password | Send reset email |
| POST | /reset-password | Reset password with token |
| GET | /verify-email/:token | Verify email address |
| POST | /resend-verification | Resend verification email |

### Product Routes — /api/v1/products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | List products (search + filter) |
| GET | /:id | Get product by ID |
| GET | /slug/:slug | Get product by slug |
| POST | / | Create product (manufacturer) |
| PUT | /:id | Update product (owner) |
| DELETE | /:id | Delete product (owner) |
| POST | /:id/images | Upload product images |
| DELETE | /:id/images/:imageId | Remove product image |
| GET | /manufacturer/:manufacturerId | Get products by manufacturer |
| GET | /categories | Get all categories with counts |
| POST | /:id/view | Increment product view count |

### Manufacturer Routes — /api/v1/manufacturers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | List manufacturers (filter/search) |
| GET | /:id | Get manufacturer profile |
| POST | /profile | Create manufacturer profile |
| PUT | /profile | Update own profile |
| POST | /profile/images | Upload factory images |
| GET | /:id/reviews | Get manufacturer reviews |
| POST | /:id/reviews | Submit review (buyer, post-order) |

### RFQ Routes — /api/v1/rfqs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | List RFQs (with filters) |
| GET | /:id | Get RFQ details |
| POST | / | Create RFQ (buyer) |
| PUT | /:id | Update RFQ (owner, if open) |
| DELETE | /:id | Delete RFQ (owner) |
| POST | /:id/close | Close RFQ |
| GET | /my-rfqs | Get buyer's own RFQs |
| GET | /incoming | Get RFQs for manufacturer |

### Quote Routes — /api/v1/quotes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /rfq/:rfqId | Get all quotes for an RFQ |
| GET | /:id | Get single quote |
| POST | / | Submit quote (manufacturer) |
| PUT | /:id | Update quote (owner, if pending) |
| POST | /:id/accept | Accept quote (buyer) |
| POST | /:id/reject | Reject quote (buyer) |
| GET | /my-quotes | Get manufacturer's own quotes |

### Message Routes — /api/v1/messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /conversations | List conversations |
| GET | /conversations/:id | Get conversation details |
| POST | /conversations | Start new conversation |
| GET | /conversations/:id/messages | Get messages in conversation |
| POST | /conversations/:id/messages | Send message |
| PUT | /conversations/:id/read | Mark messages as read |

### Order Routes — /api/v1/orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | List orders (buyer/manufacturer) |
| GET | /:id | Get order details |
| POST | / | Create order from accepted quote |
| PUT | /:id/status | Update order status (manufacturer) |
| POST | /:id/tracking | Add tracking number |

### Admin Routes — /api/v1/admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard | Platform stats |
| GET | /users | List all users |
| PUT | /users/:id/status | Ban/activate user |
| POST | /manufacturers/:id/verify | Verify manufacturer |
| GET | /rfqs | All RFQs overview |
| GET | /reports | Usage reports |

---

## 6. AUTHENTICATION SYSTEM

### JWT Strategy
- **Access Token**: Short-lived (15 minutes), contains userId, role, email
- **Refresh Token**: Long-lived (30 days), stored in MongoDB + HTTP-only cookie
- **Token Rotation**: New refresh token issued on each refresh

### auth.service.js
```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = crypto.randomBytes(40).toString('hex');
  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

### auth.middleware.js
```javascript
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.userId).select('-passwordHash');
  if (!req.user || req.user.status !== 'active') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};
```

---

## 7. EXAMPLE BACKEND CODE

### models/Product.js
```javascript
const mongoose = require('mongoose');

const priceBracketSchema = new mongoose.Schema({
  minQty: { type: Number, required: true },
  maxQty: { type: Number },
  pricePerUnit: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManufacturerProfile', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  category: {
    type: String,
    enum: ['tshirt', 'hoodie', 'kidswear', 'polo', 'formal', 'sportswear', 'innerwear', 'ethnic', 'denim', 'jacket', 'other'],
    required: true
  },
  description: { type: String },
  fabricType: { type: String },
  fabricComposition: { type: String },
  gsm: { type: Number },
  availableSizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom'] }],
  colors: [String],
  moq: { type: Number, required: true, min: 1 },
  pricePerUnit: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  priceBrackets: [priceBracketSchema],
  leadTime: { type: Number },
  customizationAvailable: { type: Boolean, default: false },
  customizationOptions: [String],
  images: [String],
  tags: [String],
  sampleAvailable: { type: Boolean, default: false },
  sampleCost: { type: Number },
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock', 'draft'], default: 'draft' },
  views: { type: Number, default: 0 },
  inquiryCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  next();
});

// Text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text', fabricType: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ manufacturerId: 1 });
productSchema.index({ pricePerUnit: 1 });

module.exports = mongoose.model('Product', productSchema);
```

### controllers/products.controller.js
```javascript
const Product = require('../models/Product');
const ManufacturerProfile = require('../models/ManufacturerProfile');
const { apiResponse } = require('../utils/apiResponse');

// GET /api/v1/products — Search + Filter
exports.getProducts = async (req, res) => {
  const {
    q, category, fabricType, minGSM, maxGSM, minPrice, maxPrice,
    minMOQ, maxMOQ, sizes, isVerified, page = 1, limit = 20, sortBy = 'createdAt'
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
};

// POST /api/v1/products — Create product
exports.createProduct = async (req, res) => {
  const manufacturerProfile = await ManufacturerProfile.findOne({ userId: req.user._id });
  if (!manufacturerProfile) {
    return apiResponse(res, 400, false, 'Complete manufacturer profile first');
  }

  const product = await Product.create({
    ...req.body,
    userId: req.user._id,
    manufacturerId: manufacturerProfile._id
  });

  return apiResponse(res, 201, true, 'Product created', { product });
};

// POST /api/v1/products/:id/images — Upload images
exports.uploadProductImages = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
  if (!product) return apiResponse(res, 404, false, 'Product not found');

  // req.files handled by multer-cloudinary middleware
  const imageUrls = req.files.map(f => f.path);
  product.images.push(...imageUrls);
  await product.save();

  return apiResponse(res, 200, true, 'Images uploaded', { images: product.images });
};
```

### controllers/rfq.controller.js
```javascript
const RFQ = require('../models/RFQ');
const Quote = require('../models/Quote');
const { generateRFQNumber } = require('../utils/generateRFQNumber');
const { sendEmail } = require('../services/email.service');

// POST /api/v1/rfqs — Create RFQ
exports.createRFQ = async (req, res) => {
  const rfqNumber = await generateRFQNumber();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + (req.body.expiryDays || 30));

  const rfq = await RFQ.create({
    ...req.body,
    rfqNumber,
    buyerId: req.user._id,
    expiryDate,
    status: 'open'
  });

  // Notify relevant manufacturers (optional background job)
  return apiResponse(res, 201, true, 'RFQ created', { rfq });
};

// POST /api/v1/quotes — Submit quote (manufacturer)
exports.submitQuote = async (req, res) => {
  const rfq = await RFQ.findById(req.body.rfqId);
  if (!rfq || rfq.status !== 'open') {
    return apiResponse(res, 400, false, 'RFQ is not open for quotes');
  }

  const existingQuote = await Quote.findOne({
    rfqId: req.body.rfqId,
    manufacturerId: req.user._id
  });
  if (existingQuote) {
    return apiResponse(res, 400, false, 'You have already submitted a quote for this RFQ');
  }

  const totalAmount = req.body.pricePerUnit * rfq.requiredQuantity;
  const quote = await Quote.create({
    ...req.body,
    manufacturerId: req.user._id,
    buyerId: rfq.buyerId,
    totalAmount,
    status: 'pending'
  });

  await RFQ.findByIdAndUpdate(req.body.rfqId, { $inc: { quoteCount: 1 }, status: 'quoted' });

  // Notify buyer
  await sendEmail({
    to: rfq.buyerEmail,
    subject: `New quote received for RFQ #${rfq.rfqNumber}`,
    template: 'new-quote',
    data: { rfqNumber: rfq.rfqNumber, quoteId: quote._id }
  });

  return apiResponse(res, 201, true, 'Quote submitted', { quote });
};
```

### utils/apiResponse.js
```javascript
exports.apiResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};
```

### middleware/upload.js
```javascript
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'tirupur-hub/products', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], transformation: [{ width: 1200, crop: 'limit' }] }
});

const factoryStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'tirupur-hub/factories', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], transformation: [{ width: 1600, crop: 'limit' }] }
});

exports.uploadProductImages = multer({ storage: productStorage, limits: { fileSize: 5 * 1024 * 1024 } }).array('images', 10);
exports.uploadFactoryImages = multer({ storage: factoryStorage, limits: { fileSize: 10 * 1024 * 1024 } }).array('images', 20);
```

### app.js
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const rfqRoutes = require('./routes/rfq.routes');
const quoteRoutes = require('./routes/quotes.routes');
const messageRoutes = require('./routes/messages.routes');
const orderRoutes = require('./routes/orders.routes');
const manufacturerRoutes = require('./routes/manufacturer.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/manufacturers', manufacturerRoutes);
app.use('/api/v1/rfqs', rfqRoutes);
app.use('/api/v1/quotes', quoteRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/orders', orderRoutes);

app.use(errorHandler);
module.exports = app;
```

---

## 8. EXAMPLE FRONTEND CODE

### api/axios.js
```javascript
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newToken = await useAuthStore.getState().refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
```

### store/authStore.js (Zustand)
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

export const useAuthStore = create(persist(
  (set, get) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    login: async (email, password) => {
      const { data } = await api.post('/auth/login', { email, password });
      set({ user: data.data.user, accessToken: data.data.accessToken, isAuthenticated: true });
      return data.data.user;
    },

    logout: async () => {
      await api.post('/auth/logout');
      set({ user: null, accessToken: null, isAuthenticated: false });
    },

    refreshToken: async () => {
      const { data } = await api.post('/auth/refresh-token');
      set({ accessToken: data.data.accessToken });
      return data.data.accessToken;
    },
  }),
  { name: 'auth-storage', partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }) }
));
```

### pages/manufacturer/AddProductPage.jsx
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const CATEGORIES = ['tshirt', 'hoodie', 'kidswear', 'polo', 'formal', 'sportswear', 'innerwear', 'ethnic', 'denim', 'jacket', 'other'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom'];

export default function AddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', category: '', fabricType: '', fabricComposition: '',
    gsm: '', moq: '', pricePerUnit: '', description: '',
    availableSizes: [], customizationAvailable: false, sampleAvailable: false,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSizeToggle = (size) => {
    setForm(prev => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(size)
        ? prev.availableSizes.filter(s => s !== size)
        : [...prev.availableSizes, size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/products', { ...form, status: 'active' });
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(img => formData.append('images', img));
        await api.post(`/products/${data.data.product._id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/manufacturer/products');
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Product Information</h2>
          <input className="w-full border rounded-lg px-3 py-2"
            placeholder="Product Name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} required />
          <select className="w-full border rounded-lg px-3 py-2"
            value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
            <option value="">Select Category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea className="w-full border rounded-lg px-3 py-2" rows={4}
            placeholder="Product Description" value={form.description}
            onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        {/* Fabric Details */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Fabric Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            <input className="border rounded-lg px-3 py-2"
              placeholder="Fabric Type (e.g. Cotton)" value={form.fabricType}
              onChange={e => setForm({...form, fabricType: e.target.value})} />
            <input className="border rounded-lg px-3 py-2"
              placeholder="Composition (e.g. 100% Cotton)" value={form.fabricComposition}
              onChange={e => setForm({...form, fabricComposition: e.target.value})} />
            <input type="number" className="border rounded-lg px-3 py-2"
              placeholder="GSM" value={form.gsm}
              onChange={e => setForm({...form, gsm: e.target.value})} />
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Available Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(size => (
              <button type="button" key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors
                  ${form.availableSizes.includes(size)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Pricing & MOQ</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Price per Unit (₹)</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2"
                placeholder="0.00" value={form.pricePerUnit}
                onChange={e => setForm({...form, pricePerUnit: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Minimum Order Qty</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2"
                placeholder="100" value={form.moq}
                onChange={e => setForm({...form, moq: e.target.value})} required />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Product Images</h2>
          <input type="file" multiple accept="image/*"
            onChange={e => setImages(Array.from(e.target.files))}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <p className="text-xs text-gray-400 mt-2">Upload up to 10 images. Max 5MB each.</p>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
            hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {loading ? 'Publishing...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
}
```

---

## 9. DEPLOYMENT STRATEGY

### Infrastructure Stack
```
Production Environment:
├── Frontend → Vercel (auto-deploy from GitHub main)
│   ├── Build: vite build
│   └── Env: VITE_API_URL=https://api.tirupurtextilehub.com
│
├── Backend → Railway or Render (Docker)
│   ├── Dockerfile provided
│   ├── Auto-scaling enabled
│   └── Health check: GET /api/v1/health
│
├── Database → MongoDB Atlas (M10 cluster, Singapore region)
│   ├── Replica set (3 nodes)
│   ├── Auto-backups daily
│   └── VPC peering with backend
│
├── Cache → Redis Cloud (Upstash free tier → paid)
│
├── Media → Cloudinary (Free tier → paid as needed)
│
└── Email → SendGrid (3000 emails/day free)
```

### Dockerfile (Backend)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Environment Variables
```env
# Backend .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tirupur-hub
JWT_SECRET=your-256-bit-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
SENDGRID_API_KEY=SG.xxxx
FRONTEND_URL=https://tirupurtextilehub.com
REDIS_URL=redis://xxxx
```

---

## 10. SCALABILITY RECOMMENDATIONS

### Phase 1 (0–1,000 users)
- Single Node.js instance on Railway
- MongoDB Atlas M10 (shared)
- Cloudinary free tier
- All services in one Express app

### Phase 2 (1,000–10,000 users)
- Add Redis caching for product listings (TTL: 5 min)
- MongoDB Atlas M20 with connection pooling
- Add BullMQ for background jobs (email notifications, RFQ expiry)
- Add ElasticSearch via Atlas Search for better product search
- CDN for static assets (Cloudflare)
- Add database indexes audit

### Phase 3 (10,000+ users)
- Microservices split: Auth, Products, Messaging, Orders as separate services
- Message queue: AWS SQS or RabbitMQ for inter-service communication
- WebSocket server (Socket.io) for real-time messaging
- Horizontal scaling with load balancer (Nginx or AWS ALB)
- MongoDB Atlas M40 dedicated cluster
- Add full-text search with ElasticSearch
- Kubernetes for container orchestration (EKS or GKE)
- Implement CQRS pattern for read/write separation

### Key Optimizations to Implement Early
1. Pagination on ALL list endpoints (never return unbounded arrays)
2. MongoDB compound indexes on frequent query patterns
3. Image optimization via Cloudinary transformations (auto-format, WebP)
4. API response caching with Redis (product listings, manufacturer lists)
5. Database connection pooling (mongoose maxPoolSize: 10)
6. Lazy loading on frontend (React.lazy + Suspense for dashboard pages)
7. Virtual scrolling for long product lists
8. Input debouncing on search (300ms)
9. Optimistic UI updates for messaging
10. Rate limiting per user (not just per IP)

---

*TirupurTextileHub Architecture Blueprint — Version 1.0*
*Generated for production use. Adapt environment variables and secrets before deployment.*
