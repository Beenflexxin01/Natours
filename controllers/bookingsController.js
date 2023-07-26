const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModels');
const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const Bookings = require('../models/bookingsModel');

exports.getCheckoutSession = catchAsync(async function (req, res, next) {
  // Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    // success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
            description: tour.summary,
          },
        },
      },
    ],
    mode: 'payment',
  });
  // Send to client
  res.status(200).json({ status: 'success', session });
});

// exports.createBookingCheckout = catchAsync(async function (req, res, next) {
//   // Temporary because it is not secure as everyone can make bookings without paying
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();

//   await Bookings.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async function (session) {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_details.email }))
    ._id;
  const price = session.line_items[0].amount_total / 100;
  await Bookings.create({ tour, user, price });
};

exports.webhookCheckout = function (req, res, next) {
  // Read stripe signatures
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    // Stripe event
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed');
  createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.getAllBookings = factory.getAll(Bookings);

exports.getBookings = factory.getOne(Bookings);

exports.createBookings = factory.createOne(Bookings);

exports.updateBookings = factory.updateOne(Bookings);

exports.deleteBooking = factory.deleteOne(Bookings);
