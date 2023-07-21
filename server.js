const mongoose = require('mongoose');
// After installing the dotenv dependencies using npm install dotenv
const dotenv = require('dotenv');

// HANDLING UNCAUGHT EXCEPTIONS - ALL bugs that are in our synchronous code but are not handled anywhere!
process.on('uncaughtException', function (err) {
  console.log(err.message);
  console.log('UNCAUGHT EXCEPTION 💥 Shutting down NOW....');

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

// AFter installatioon of Mongoose
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log('DB connection successful😁😁');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, function () {
  console.log('App is running on port 3000.....');
});

// HANDLING UNHANDLED REJECTIONS
process.on('unhandledRejection', function (err) {
  console.log(err.name);
  console.log('UNHANDLED REJECTION! 😣 Shutting down...');
  server.close(function () {
    process.exit(1);
  });
});

process.on('SIGTERM', function () {
  console.log('🤗 SIGTERM RECEOVED, Shutting down gracefully')
  server.close(function () {
    console.log('🔥 Process Terminated')
  })
})
