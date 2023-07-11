/* eslint-disable */
export const displayMap = function (locations) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicmVzdGxlc3Mtcm9ib3QyNCIsImEiOiJjbGp1MnYybjYwMnJjM2RxemhhNWNkaDduIn0.9x90sba1_d6TE8H7_8Jg3Q';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/restless-robot24/clju2y5en01k601o4hngm04s2',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 10,
    //   interactive: false,
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
