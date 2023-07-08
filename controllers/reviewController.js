const Review = require('../models/reviewModel');

const factory = require('./handlerFactory');
// const APIFeatures = require('../utils/APIFeatures');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

exports.setTourUserIds = function (req, res, next) {
  // Nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.getReviews = factory.getOne(Review);

exports.createReviews = factory.createOne(Review);

exports.updateReviews = factory.updateOne(Review);

exports.deleteReviews = factory.deleteOne(Review);
