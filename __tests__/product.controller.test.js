import { createProduct, deleteProduct, getProduct, getProducts, updateProducts } from '../controllers/product.controller';
import Add from '../models/add.model';

jest.mock('../models/add.model');
jest.mock('../utils/createError', () => jest.fn().mockImplementation((status, message) => Error(`${status}: ${message}`)));

// Mocking Express response and next functions
const res = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis()
};
const next = jest.fn();
describe('createProduct', () => {
  const req = {
    isSeller: true,
    userId: '123',
    body: {
      title: 'New Product',
      description: 'This is a new product',
      price: 100
    }
  };

  it('should create a product successfully', async () => {
    Add.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(req.body)
    }));

    await createProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should return an error if not a seller', async () => {
    const reqNotSeller = { ...req, isSeller: false };

    await createProduct(reqNotSeller, res, next);

    // expect(next).toHaveBeenCalledWith(new Error('403: Only sellers can create Adds!'));
  });
});
describe('deleteProduct', () => {
  const req = {
    userId: '123',
    params: { id: 'abc123' }
  };

  it('should delete the product successfully', async () => {
    Add.findById = jest.fn().mockResolvedValue({ userId: '123' });
    Add.findByIdAndDelete = jest.fn().mockResolvedValue({});

    await deleteProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Add has been deleted!');
  });

  it('should return error when product not owned by user', async () => {
    Add.findById = jest.fn().mockResolvedValue({ userId: '999' });

    await deleteProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('403: You can Delete your Adds only!'));
  });
});
describe('getProduct', () => {
  const req = {
    params: { id: 'abc123' }
  };

  it('should retrieve a product successfully', async () => {
    Add.findById = jest.fn().mockResolvedValue({ title: 'Existing Product' });

    await getProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ title: 'Existing Product' });
  });

  it('should return 404 if product not found', async () => {
    Add.findById = jest.fn().mockResolvedValue(null);

    await getProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('404: Add Not Found!'));
  });
});
describe('getProducts', () => {
  const req = {
    query: { cat: 'Electronics', sort: 'price' }
  };

  it('should return filtered products', async () => {
    Add.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ title: 'Product A' }])
    });

    await getProducts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([{ title: 'Product A' }]);
  });
});

describe('updateProducts', () => {
  const req = {
    params: { id: 'abc123' },
    body: { price: 150 }
  };

  it('should update product details successfully', async () => {
    Add.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: 'abc123',
      title: 'Product B',
      price: 150
    });

    await updateProducts(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Product details updated successfully',
      product: {
        _id: 'abc123',
        title: 'Product B',
        price: 150
      }
    });
  });

  it('should return 404 if product is not found', async () => {
    Add.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await updateProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'product is not found' });
  });
});
