/* eslint-disable */
// import '@babel/polyfill';
import { displayMap } from './mapBox';
import { login } from './login';

// DOM EL
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form');

// Delegation
if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);

  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
