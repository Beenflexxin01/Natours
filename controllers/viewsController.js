const Tour = require('../models/tourModels');

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

exports.getTour = catchAsync(async function (req, res) {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reveiw rating user',
  });
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
