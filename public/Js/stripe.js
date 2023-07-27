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
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // Create checkout form + charge the cr card for us
    // window.location.assign(session.data.session.url);
     await stripe.redirectToCheckout({
       sessionId: session.data.session.id
     });
  } catch (err) {
    showAlert('error', err);
  }
};
