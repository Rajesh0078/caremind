export const authorizePermission = (permissionKey) => {
  return (req, res, next) => {
    if (!req.user?.roles) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const hasPermission = req.user.roles.some(role =>
      role.isActive &&
      Array.isArray(role.permissions) &&
      role.permissions.some(p => p.key === permissionKey)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};
