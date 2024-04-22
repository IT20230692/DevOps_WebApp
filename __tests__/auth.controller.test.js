// Login controller tests
import { login } from '../controllers/auth.controller.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../models/user.model.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../utils/createError.js', () => jest.fn().mockImplementation((status, message) => ({ status, message })));

// Mocking Express response and next functions
const res = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
};
const next = jest.fn();
describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clears instances and calls to constructor and all methods
  });

  const req = {
    body: {
      username: 'testUser',
      password: 'testPass'
    }
  };

  it('should validate username and password are provided', async () => {
    const reqMissingFields = {
      body: {}
    };

    await login(reqMissingFields, res, next);

    expect(next).toHaveBeenCalledWith({ status: 400, message: 'Username and password are required.' });
  });

  it('should return 404 if user not found', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith({ status: 404, message: 'User not found!' });
  });

  it('should return 400 if password is incorrect', async () => {
    User.findOne = jest.fn().mockResolvedValue({
      _id: '123',
      password: 'hashedPassword'
    });
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith({ status: 400, message: 'Wrong password or username!' });
  });

  it('should successfully log in and return a token and user info', async () => {
    const userMock = {
      _id: '123',
      isSeller: false,
      password: 'hashedPassword',
      toObject: jest.fn(() => ({
        _id: '123',
        username: 'testUser',
        isSeller: false
      }))
    };
    User.findOne = jest.fn().mockResolvedValue(userMock);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue('fakeToken123');

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'fakeToken123',
      info: {
        _id: '123',
        username: 'testUser',
        isSeller: false
      }
    });
  });
});
