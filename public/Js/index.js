/* eslint-disable */
// import '@babel/polyfill';
import { displayMap } from './mapbox.js';
import { login, logout } from './login';

// DOM EL
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

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

if (logOutBtn) logOutBtn.addEventListener('click', logout);
