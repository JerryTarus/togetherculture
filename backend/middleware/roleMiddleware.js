
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).json({ message: 'Access denied: You dont have permissions' });
    next();
  };
};

module.exports = authorize;
