

const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt; 
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.redirect('/login'); // Si el token no es válido o expiró, redirige al usuario al inicio de sesión
      } else {
        req.user = decoded; // Agrega la información del usuario decodificada a la solicitud
        next(); // Continúa con la ejecución de la siguiente función en la ruta
      }
    });
  } else {
    res.redirect('/login'); // Si no hay token, redirige al usuario al inicio de sesión
  }
};

module.exports = isAuthenticated;
