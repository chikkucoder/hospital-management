const jwt = require("jsonwebtoken");

/**
 * Generate a JWT access token for a given user.
 * @param {Object} user - User document from MongoDB
 * @param {string} user._id - User ID
 * @param {string} user.role - User role
 * @returns {string} Signed JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET || "default_jwt_secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = { generateToken };
