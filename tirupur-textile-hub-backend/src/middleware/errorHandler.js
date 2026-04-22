const { apiResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return apiResponse(res, statusCode, false, message, process.env.NODE_ENV === 'development' ? { stack: err.stack } : null);
};

module.exports = errorHandler;
