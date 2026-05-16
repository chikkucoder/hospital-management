const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication middleware - verifies JWT token from Authorization header.
 * Attaches decoded user to req.user on success.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "No token provided, authorization denied" },
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "No token provided, authorization denied" },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret");

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "User not found, authorization denied" },
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: { code: "ACCOUNT_DEACTIVATED", message: "Account has been deactivated" },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_TOKEN", message: "Invalid token" },
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: { code: "TOKEN_EXPIRED", message: "Token has expired" },
      });
    }
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Authentication error" },
    });
  }
};

module.exports = authMiddleware;
