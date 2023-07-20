const mongoose = require('mongoose');

// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require('slugify');
// SCHEMA IN PRACTICE
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must have lte 40 characters'],
      minlength: [10, 'Tour name must have gte 10 characters'],
      // validate: [
      //   validator.isAlpha,
      //   'Tour name must only contain characters and not numbers!',
      // ],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: ' Difficulty is either Easy, Medium or Difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must not be above 5.0'],
      set: function (val) {
        return Math.round(val * 10) / 10;
      },
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price!'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        // Defining our own validator (CUSTOM VALIDATORS)
        validator: function (val) {
          // WON'T WORK WITH UPDATE.. CAN ONLY WORK ON NEW DOCS
          return val < this.price;
        },
        message: 'Discount Price {{VALUE}} should be below the reqular price',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, ' A tour must have a cover image'],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [String],

    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      // GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // EMBEDDED DOCS
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // CHILD REFERENCING
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// DURATION IN WEEKS [BUSINESS LOGIC]
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENTS MIDDLEWARE - RUNS BEFORE .save() and .create() -- Not on .insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE - RUN FUNCTIONS BEFORE OR AFTER QUERY IS EXECUTED
// tourSchema.pre(find, function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  // SET TIMER
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} in milliseconds `);
//   next();
// });

// AGGREGATION MIDDLEWARE- ADD HOOKS BEFORE AND AFTER AN AGGREGATION HAPPENS
// tourSchema.pre('aggregate', function (next) {
//   //ADD At THE BEGINING OF AN ARRAY..... SHIFT AT THE END.
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
