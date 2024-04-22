import User from '../models/user.model.js';
import createError from '../utils/createError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

// User registration
export const register = async (req, res, next) => {
  try {
    // Connect to retrieve JWT key
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send('User has been created successfully.');
  } catch (err) {
    next(err);
  }
};

// User login
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return next(createError(400, 'Username and password are required.'));
    }

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return next(createError(404, 'User not found!'));
    }

    // Compare passwords
    const isCorrect = await bcrypt.compare(password, user.password);
    console.log("testing github action,",isCorrect);

    if (!isCorrect) {
      return next(createError(400, 'Wrong password or username!'));
    }
    const JWT_KEY = await connect();
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      JWT_KEY
    );

    // Respond with token and user info
    const { password: userPassword, ...userInfo } = user.toObject(); // Exclude password from user info
    res.status(200).json({ token, info: userInfo });
  } catch (err) {
    next(err);
  }
};


