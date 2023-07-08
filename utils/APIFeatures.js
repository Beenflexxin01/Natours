class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(function (el) {
      return delete queryObj[el];
    });
    // ADVANCED FILTERING
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, function (match) {
      return `$${match}`;
    });
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort{'-price,ratingAverage}
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

/////////////////////////////////
// BUILD QUERY
// FILTERING
// eslint-disable-next-line node/no-unsupported-features/es-syntax
// const queryObj = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(function (el) {
//   return delete queryObj[el];
// });
// // ADVANCED FILTERING
// let queryString = JSON.stringify(queryObj);
// queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, function (match) {
//   return `$${match}`;
// });
// console.log(JSON.parse(queryString));

// let query = Tour.find(JSON.parse(queryString));

// SORTING
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
//   // sort{'-price,ratingAverage}
// } else {
//   query = query.sort('-createdAt');
// }

// FIELD LIMITING [EXCLUDING SOME COLLECTIONS]
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query.select('-__v');
// }

// // PAGINATION USING QUERY STRINGS
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('This page does not exist');
// }
