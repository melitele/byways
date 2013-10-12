var maps = require('maps');
var dataset = require('dataset');

// US maps coordinates
// bounding box: -125.1, 25, -67, 49.6
// Centroid: -95.9669, 37.1669

/*global google*/


function forEachNode(nodelist, fn, thisArg) {
  var i;
  for(i = 0; i < nodelist.length; i++) {
    fn.call(thisArg, nodelist[i], i);
  }
}

function markers(map) {
  var sections = document.querySelectorAll('.byway-list[data-color]'),
    zindex = sections.length;
  forEachNode(sections, function(section) {
    var color = 'hsl(' + dataset(section, 'color') + ', 100%, 50%)',
      byways = section.querySelectorAll('a[data-ll]');
    forEachNode(byways, function(a) {
      maps
        .marker({
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            strokeColor:  '#777777',
            strokeWeight: 2,
            scale: 5
          },
          position: JSON.parse(dataset(a, 'll')),
          title: a.textContent || a.innerHTML,
          zIndex: zindex
        })
        .add(map)
        .on('click', function(e) {
          console.log(e);
          window.location = a.getAttribute('href');
        });
    });
    zindex--;
  });
}

function render(mapEl) {
  var _gm = google.maps, map;

  map = maps.map(mapEl, {
    scrollwheel: false,
    zoomControl: true,
    zoomControlOptions: {
        style: _gm.ZoomControlStyle.SMALL,
        position: _gm.ControlPosition.RIGHT_BOTTOM
    },
    mapTypeControl: false,
    backgroundColor: '#4E86C5',
    mapTypeId: _gm.MapTypeId.ROADMAP,
    styles: require('./styles'),
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