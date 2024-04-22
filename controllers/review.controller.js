import createError from '../utils/createError.js';
import Review from '../models/review.model.js';
import Add from '../models/add.model.js';

export const createReview = async (req, res, next) => {
  console.log('create review');
  
  // Check if the user is a seller
  if (req.isSeller) {
    return next(createError(403, "Sellers can't create a review!"));
  }

  // Extract data from request body
  const { addId, desc, star } = req.body;

  try {
    // Check if the user has already created a review for this add
    const existingReview = await Review.findOne({ addId, userId: req.userId });
    if (existingReview) {
      return next(createError(403, 'You have already created a review for this add!'));
    }

    // Create a new review
    const newReview = new Review({
      userId: req.userId,
      addId,
      desc,
      star,
    });

    // Save the review
    const savedReview = await newReview.save();

    // Update the corresponding Add document with the new review data
    await Add.findByIdAndUpdate(addId, {
      $inc: { totalStars: star, starNumber: 1 },
    });

    // Respond with the saved review
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};


export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findById(req.params.id); 
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};


// Get reviews by address
export const getallReviewsByproductId = async (req, res, next) => {
  try {
    const addId = req.params.productId;
    console.log(addId);
    // Find all delivery records with the specified address
    const reviews = await Review.find({ addId: addId });

    if (!reviews || reviews.length === 0) {
      return next(createError(404, 'No reviews Found for the product!'));
    }

    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};


