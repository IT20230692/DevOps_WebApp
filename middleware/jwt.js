import jwt from 'jsonwebtoken';
import createError from '../utils/createError.js';
import getSecret from '../config/secrets.js';

// retrieve JWT key
const connect = async () => {
  try {
    const secret = await getSecret();
    const JWT_KEY = secret.JWT_KEY;
    return JWT_KEY;
  } catch (error) {
    console.log(error);
  }
};

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    // Connect to retrieve JWT key
    const JWT_KEY = await connect();

    // Using optional chaining to simplify the check
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(createError(401, 'You are not authenticated!'));
    }

    jwt.verify(token, JWT_KEY, (err, payload) => {
      if (err) {
        return next(createError(403, 'Token is not valid!'));
      }
      req.userId = payload.id;
      req.isSeller = payload.isSeller;
      next();
    });
  } catch (error) {
    return next(createError(500, 'Internal Server Error'));
  }
};
