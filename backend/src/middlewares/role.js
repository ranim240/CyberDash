/**
 * Middleware to restrict access based on user roles.
 * Usage: router.get('/route', isAuthenticated, authorize(['admin', 'instructor']), handler)
 * @param {string[]} allowedRoles - Array of roles that are permitted.
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: no user found' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};
