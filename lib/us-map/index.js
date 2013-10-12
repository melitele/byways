var maps = require('maps');
var dataset = require('dataset');

// US maps coordinates
// bounding box: -125.1, 25, -67, 49.6
// Centroid: -95.9669, 37.1669

function forEachNode(nodelist, fn, thisArg) {
  var i;
  for(i = 0; i < nodelist.length; i++) {
    fn.call(thisArg, nodelist[i], i);
  }
}

function markers(map) {
  var byways = document.querySelectorAll('.byway-list a[data-ll]');
  forEachNode(byways, function(a) {
    maps
      .marker({
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#228822',
          fillOpacity: 1,
          strokeColor:  '#777777',
          strokeWeight: 2,
          scale: 5
        },
        position: JSON.parse(dataset(a, 'll')),
        title: a.textContent || a.innerHTML
      })
      .add(map)
      .on('click', function() {
        window.location = a.getAttribute('href');
      });
  });
}

function render(mapEl) {
  var map = maps.map(mapEl, {
    scrollwheel: false,
    zoom: 7,
    center: [-95, 37]
  }).fitBounds([[-125.1, 25], [-67, 49.6]]);
  // don't block map rendering with markers
  setTimeout(markers.bind(null, map), 100);
}

function usMap() {
  var mapEl = document.querySelector('.us-map');
  if (mapEl) {
    maps.init(render.bind(null, mapEl));
  }
}

module.exports = usMap;