/* eslint-disable */
import axios from 'axios';
import Stripe from 'stripe';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51NVgroG6YvrqYWiWlqvNllGDi3fQfLlEn44mSl9rb4GHcnAJ0DnfPtCulrWgrje8Ubu0KIxph9nwR21hStFzrIt700nZZRGQsP'
);

export const bookTour = async function (tourId) {
  try {
    // get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // Create checkout form + charge the cr card for us
    window.location.assign(session.data.session.url);
  } catch (err) {
    showAlert('error', err);
  }
};
