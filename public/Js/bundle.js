// var $a0O4r$axios = require("axios");
import { $iniLV$axios } from 'https://cdn.skypack.dev/axios';

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
/* eslint-disable */ // import '@babel/polyfill';
/* eslint-disable */ const $295ac5c09d785e78$export$4c5dd147b21b9176 =
  function (locations) {
    mapboxgl.accessToken =
      'pk.eyJ1IjoicmVzdGxlc3Mtcm9ib3QyNCIsImEiOiJjbGp1MnYybjYwMnJjM2RxemhhNWNkaDduIn0.9x90sba1_d6TE8H7_8Jg3Q';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/restless-robot24/clju2y5en01k601o4hngm04s2',
      scrollZoom: false,
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc) => {
      // Createe marker
      const el = document.createElement('div');
      el.className = 'marker';
      // Add Marker
      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(loc.coordinates)
        .addTo(map);
      // Add popup
      new mapboxgl.Popup({
        offset: 30,
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
      // Extend the map bounds to include the current location
      bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
  };

/* eslint-disable */
/* eslint-disable */ const $c57701e316533478$export$516836c6a9dfc573 = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
const $c57701e316533478$export$de026b00723010c1 = (type, msg) => {
  $c57701e316533478$export$516836c6a9dfc573();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout($c57701e316533478$export$516836c6a9dfc573, 5000);
};

const $ec65683c27695e18$export$596d806903d1f59e = async (email, password) => {
  try {
    const res = await (0, $parcel$interopDefault($iniLV$axios))({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
    });
    res.data.status = 'success';
    (0, $c57701e316533478$export$de026b00723010c1)(
      'success',
      'Logged in successfully!'
    );
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    (0, $c57701e316533478$export$de026b00723010c1)(
      'error',
      err.response.data.message
    );
  }
};

// DOM EL
const $e1f08386ea741b04$var$mapbox = document.getElementById('map');
const $e1f08386ea741b04$var$loginForm = document.querySelector('.form');
// Delegation
if ($e1f08386ea741b04$var$mapbox) {
  const locations = JSON.parse($e1f08386ea741b04$var$mapbox.dataset.locations);
  (0, $295ac5c09d785e78$export$4c5dd147b21b9176)(locations);
}
if ($e1f08386ea741b04$var$loginForm)
  $e1f08386ea741b04$var$loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    (0, $ec65683c27695e18$export$596d806903d1f59e)(email, password);
  });

//# sourceMappingURL=bundle.js.map
