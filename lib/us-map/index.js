var maps = require('maps');
var dataset = require('dataset');

// US maps coordinates
// bounding box: -125.1, 25, -67, 49.6
// Centroid: -95.9669, 37.1669

/*global google*/

function bounds(path) {
  var sw, ne;
  if (!path || !path.length) {
    return;
  }
  sw = path[0].slice();
  ne = path[0].slice();
  path.forEach(function(point) {
    var i;
    for(i = 0; i < 2; i++) {
      if(point[i] < sw[i]) {
        sw[i] = point[i];
      } else if (point[i] > ne[i]) {
        ne[i] = point[i];
      }
    }
  });
  return [sw, ne];
}


function forEachNode(nodelist, fn, thisArg) {
  var i;
  for(i = 0; i < nodelist.length; i++) {
    fn.call(thisArg, nodelist[i], i);
  }
}

function marker(opts, a) {
  var ds = dataset(a),
    color = ds.get('color') || opts.color,
    bounds = ds.get('bounds'),
    path = ds.get('path');

  function onclick() {
    window.location = a.getAttribute('href');
  }

  maps.marker({
    map: opts.map,
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
    zIndex: opts.zIndex
  })
  .on('click', onclick);
  if (path) {
    maps.polyline({
      map: opts.map,
      strokeColor: color,
      strokeWeight: 3,
      zIndex: opts.zIndex,
      path: path
    })
    .on('click', onclick);
  }
  return bounds && JSON.parse(bounds);
}

function markers(map) {
  var sections = document.querySelectorAll('.byway-list'),
    points = [];
  forEachNode(sections, function(section, index) {
    var color = dataset(section, 'color'),
      byways = section.querySelectorAll('a[data-ll]');

    forEachNode(byways, function(byway) {
      var b = marker({
        map: map,
        zIndex: 40 - index,
        color: color
      }, byway);
      if (b) {
        points = points.concat(b);
      }
    });
  });
  return points;
}

function render(mapEl) {
  var _gm = google.maps, map, points;

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
    styles: require('./styles')
  });

  points = markers(map);
  points = bounds(points) || [[-125.1, 25], [-67, 49.6]];
  map.fitBounds(points);
}

function map() {
  var usMap = document.querySelector('.us-map'),
    stateMap = document.querySelector('.state-map');
  if (usMap || stateMap) {
    maps.init({
      libraries: 'geometry'
    }, render.bind(null, usMap || stateMap));
  }
}

module.exports = map;