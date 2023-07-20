const Tour = require('../models/tourModels');
const Bookings = require('../models/bookingsModel');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async function (req, res, next) {
  // Get Tour Data From Collection
  const tours = await Tour.find();
  // Build Template

  // Render the template using the tour data from st 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async function (req, res, next) {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reveiw rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res
    .status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getLoginForm = function (req, res) {
  res.status(200).render('login', { title: 'Log into your account' });
};

exports.getAccount = function (req, res) {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

// Traditional method of updating user data.
exports.updateUserData = catchAsync(async function (req, res, next) {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser,
  });
});

exports.getMyTours = catchAsync(async function (req, res, next) {
  // Find all bookings
  const bookings = await Bookings.find({ user: req.user.id });

  // Find tours with the returned Id's
  const tourId = bookings.map(function (el) {
    return el.tour;
  });
  const tours = await Tour.find({ _id: { $in: tourId } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
