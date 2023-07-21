/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if ((res.data.status = 'success')) {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async function () {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out, try again!');
  }
};


//  "watch": "parcel watch ./public/Js/index.js --dist-dir ./public/Js/bundle",
// "build": "parcel build ./public/Js/index.js --dist-dir ./public/Js/bundle"