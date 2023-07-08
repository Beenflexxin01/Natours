const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModels');
const Reviews = require('../../models/reviewModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(function () {
    console.log('DB connection successful👴');
  });

//   READING JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/review.json`, 'utf-8')
);

// IMPORT DATA TO DATABASE
const importData = async function () {
  try {
    await Tour.create(tours);
    await Reviews.create(reviews, { validateBeforeSave: false });
    await User.create(users, { validaetBeforeSave: false });
    console.log('Data successfully loaded 👲!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB COLLECTION
const deleteData = async function () {
  try {
    await Tour.deleteMany();
    await Reviews.deleteMany();
    await User.deleteMany();
    console.log('Data has been successfully deleted 😪');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);
