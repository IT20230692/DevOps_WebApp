import Add from '../models/add.model.js';
import createError from '../utils/createError.js';

//create a new add for sellers
export const createProduct = async (req, res, next) => {
  console.log('test add');
  if (!req.isSeller)
    return next(createError(403, 'Only sellers can create a Adds!'));

  const newAdd = new Add({
    userId: req.userId,
    ...req.body,
  });
  try {
    const savedAdd = await newAdd.save();
    res.status(201).json(savedAdd);
  } catch (err) {
    next(err);
  }
};

//create delete function for sellers' adds
export const deleteProduct = async (req, res, next) => {
  try {
    const add = await Add.findById(req.params.id);

    if (add.userId !== req.userId)
      return next(createError(403, 'You can Delete your Adds only!'));
    await Add.findByIdAndDelete(req.params.id);
    res.status(200).send('Add has been deleted!');
  } catch (err) {
    next(err);
  }
};

//get seleted add from Add model
export const getProduct = async (req, res, next) => {
  try {
    const add = await Add.findById(req.params.id);
    if (!add) return next(createError(404, 'Add Not Found!'));
    res.status(200).send(add);
  } catch (err) {
    next(err);
  }
};

//get ads according to filtering
export const getProducts = async (req, res, next) => {
  const q = req.query;

  // Define allowed query parameters and their corresponding database fields
  const allowedFilters = {
    userId: 'userId',
    cat: 'cat',
    min: 'price',
    max: 'price',
    search: 'title',
  };

  // Validate and sanitize query parameters
  const filters = {};
  Object.keys(q).forEach(key => {
    if (allowedFilters.hasOwnProperty(key)) {
      if (key === 'search') {
        filters[allowedFilters[key]] = { $regex: new RegExp(q[key], 'i') };
      } else {
        filters[allowedFilters[key]] = q[key];
      }
    }
  });

  try {
    // Execute the database query with validated and sanitized filters
    const ads = await Add.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(ads);
  } catch (err) {
    next(err);
  }
};



//create update selected product
export const updateProducts = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find product by ID and update product details
    const updatedProduct = await Add.findByIdAndUpdate(
      productId,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'product is not found' });
    }

    return res.json({
      message: 'Product details updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
