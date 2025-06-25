const role = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).send({ error: 'Acceso no autorizado.' });
    }
    next();
  };
};

module.exports = role;