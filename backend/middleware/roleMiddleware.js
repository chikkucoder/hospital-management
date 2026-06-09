module.exports = function roleMiddleware(role) {
  return (req, res, next) => {
    next();
  };
};
