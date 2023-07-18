const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModels');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const uploads = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImg = uploads.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImg = function (req, res, next) {
  console.log(req.files);

  next();
};

// No Img Cover.. Multiple (same name)
// uploads.array('images', 5);
// uploads.single('image) re.file
// uploads.fields('image', 'imageCover') req.files

// BUILDING MIDDLEWARE FOR ALIASING
exports.aliasTopTours = function (req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,ratingsAverage,price,duration,difficulty,summary';

  next();
};

// ROUTE_HANDLERS
exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

// AGGREGATION PIPELINE: MATCHING AND GROUPING
exports.getTourStats = catchAsync(async function (req, res, next) {
  const stats = await Tour.aggregate([
    {
      // select and filter objects
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    {
      // group docs together using accumulators
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        numRating: { $sum: '$ratingQuantity' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },

    {
      $sort: { avgPrice: 1 },
    },

    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({ status: 'success', data: stats });
});

// AGGREGATION PIPELINE: UNWINDING AND PROJECTING
exports.getMonthlyPlan = catchAsync(async function (req, res, next) {
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },

    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
        price: { $gte: 500 },
      },
    },

    {
      $group: {
        _id: { $month: { $dateFromString: { dateString: '$startDates' } } },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: { month: '$_id' },
    },

    {
      $project: {
        _id: 0,
      },
    },

    {
      $sort: { numToursStarts: -1 },
    },

    {
      $limit: 12,
    },
  ]);

  res.status(200).json({ status: 'success', data: { plan } });
});

exports.getToursWithin = catchAsync(async function (req, res, next) {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude or longitude in the format lat,lng',
        404
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res
    .status(200)
    .json({ status: 'Success', results: tours.length, data: { tours } });
});

exports.getToursDistance = catchAsync(async function (req, res, next) {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude or longitude in the format lat,lng',
        404
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: { data: distances },
  });
});
// tours - within / 233 / center / 34.111745, -118.113491 / unit / mi;
