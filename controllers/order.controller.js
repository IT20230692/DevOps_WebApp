import Order from '../models/order.model.js';
import createError from '../utils/createError.js';

//create a new delivery for sellers
export const createOrder = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, 'Only users can create Order option!'));

  const newOrder = new Order({
    userId: req.userId,
    ...req.body,
  });
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
};
