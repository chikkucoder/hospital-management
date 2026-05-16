/**
 * Role-based authorization middleware.
 * Accepts a single role string or an array of allowed roles.
 * Must be used AFTER authMiddleware (requires req.user).
 *
 * Usage:
 *   roleMiddleware("ADMIN")           // single role
 *   roleMiddleware(["DOCTOR", "ADMIN"]) // multiple roles
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required before role check" },
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Access denied. Required role: ${roles.join(" or ")}`,
        },
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
