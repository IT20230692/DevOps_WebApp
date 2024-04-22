// Order controller tests
import { createOrder } from '../controllers/order.controller';
import Order from '../models/order.model';

jest.mock('../models/order.model');
jest.mock('../utils/createError', () => jest.fn().mockImplementation((status, message) => Error(`${status}: ${message}`)));

// Mocking Express response and next functions
const res = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis()
};
const next = jest.fn();

describe('createOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clears instances and calls to constructor and all methods
  });

  it('should create an order successfully for a non-seller user', async () => {
    const req = {
      isSeller: false,
      userId: 'user123',
      body: {
        productIds: ['product123', 'product456'],
        quantity: 2,
        total: 100
      }
    };

    Order.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        _id: 'order123',
        ...req.body,
        userId: req.userId
      })
    }));

    await createOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'order123',
      productIds: ['product123', 'product456'],
      quantity: 2,
      total: 100,
      userId: 'user123'
    });
  });

  it('should return an error if a seller tries to create an order', async () => {
    const req = {
      isSeller: true,
      userId: 'seller123',
      body: {
        productIds: ['product123'],
        quantity: 1,
        total: 50
      }
    };

    await createOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('403: Only users can create Order option!'));
  });

  it('should handle errors and pass them to the next middleware', async () => {
    const req = {
      isSeller: false,
      userId: 'user123',
      body: {
        productIds: ['product123', 'product456'],
        quantity: 2,
        total: 100
      }
    };

    const error = new Error('Database failure');
    Order.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(error)
    }));

    await createOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
