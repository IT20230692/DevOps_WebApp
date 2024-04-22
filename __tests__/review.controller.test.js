// Review controller tests
import { createReview, getReviews, getallReviewsByproductId } from '../controllers/review.controller';
import Review from '../models/review.model';
import Add from '../models/add.model';

jest.mock('../models/review.model');
jest.mock('../models/add.model');
jest.mock('../utils/createError', () => jest.fn().mockImplementation((status, message) => Error(`${status}: ${message}`)));

// Mocking Express response and next functions
const res = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis()
};
const next = jest.fn();
describe('createReview', () => {
  const req = {
    isSeller: false,
    userId: 'user123',
    body: {
      addId: 'add123',
      desc: 'Great product',
      star: 5
    }
  };

  it('should successfully create a review', async () => {
    Review.findOne = jest.fn().mockResolvedValue(null);
    Review.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        userId: req.userId,
        ...req.body
      })
    }));
    Add.findByIdAndUpdate = jest.fn().mockResolvedValue({});

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      userId: 'user123',
      addId: 'add123',
      desc: 'Great product',
      star: 5
    });
  });

  it('should not allow sellers to create a review', async () => {
    const sellerReq = { ...req, isSeller: true };

    await createReview(sellerReq, res, next);

    expect(next).toHaveBeenCalledWith(new Error('403: Sellers can\'t create a review!'));
  });

  it('should not allow duplicate reviews', async () => {
    Review.findOne = jest.fn().mockResolvedValue(true); // Simulate existing review

    await createReview(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('403: You have already created a review for this add!'));
  });
});
describe('getReviews', () => {
  const req = {
    params: { id: 'review123' }
  };

  it('should retrieve reviews successfully', async () => {
    Review.findById = jest.fn().mockResolvedValue({ desc: 'Great product', star: 5 });

    await getReviews(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ desc: 'Great product', star: 5 });
  });

  it('should handle errors when fetching reviews', async () => {
    Review.findById = jest.fn().mockRejectedValue(new Error('Database error'));

    await getReviews(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('Database error'));
  });
});
describe('getallReviewsByproductId', () => {
  const req = {
    params: { productId: 'add123' }
  };

  it('should retrieve all reviews for a product successfully', async () => {
    Review.find = jest.fn().mockResolvedValue([{ desc: 'Nice product', star: 4 }]);

    await getallReviewsByproductId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([{ desc: 'Nice product', star: 4 }]);
  });

  it('should return error if no reviews found for the product', async () => {
    Review.find = jest.fn().mockResolvedValue([]);

    await getallReviewsByproductId(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('404: No reviews Found for the product!'));
  });
});

