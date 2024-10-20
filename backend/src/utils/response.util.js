const handleResponse = (res, statusCode, status, message, data = null) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = handleResponse;
