// const helmet = require('helmet');
// const app = require('../app');
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

// app.use(
//   helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
// );

exports.getTour = catchAsync(async function (req, res) {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reveiw rating user',
  });
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
