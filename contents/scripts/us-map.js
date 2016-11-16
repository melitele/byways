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

function getDescriptors() {
  var sections = document.querySelectorAll('.byway-list'),
    points = [],
    descriptors = [];

  forEachNode(sections, function(section, index) {
    var color = dataset(section, 'color');

    forEachNode(section.querySelectorAll('a[data-ll]'), function(a) {
      var ds = dataset(a),
        bounds = ds.get('bounds'),
        ll = ds.get('ll'),
        path = ds.get('path'),
        descriptor;

      descriptor = {
        title: a.textContent || a.innerHTML,
        href: a.getAttribute('href'),
        zIndex: 40 - index,
        color: ds.get('color') || color,
        position: ll && JSON.parse(ll),
        path: path && JSON.parse(path)
      };

      if (bounds) {
        points = points.concat(JSON.parse(bounds));
      }
      descriptors.push(descriptor);
    });
  });

  return {
    points: points,
    descriptors: descriptors
  };
}

function renderMarker(map, descriptor) {
  function onclick() {
    window.location = descriptor.href;
  }
  maps.marker({
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: descriptor.color,
      fillOpacity: 1,
      strokeColor:  '#777777',
      strokeWeight: 2,
      scale: 5
    },
    position: descriptor.position,
    title: descriptor.title,
    zIndex: descriptor.zIndex
  })
  .on('click', onclick);
  if (descriptor.path) {
    descriptor.path.forEach(function (path) {
      maps.polyline({
        map: map,
        strokeColor: descriptor.color,
        strokeWeight: 3,
        zIndex: descriptor.zIndex,
        path: path
      })
      .on('click', onclick);
    });
  }
}

function renderAllMarkers(map, descriptors) {
  var start = 0;

  function work() {
    var i;
    for(i = start; i < start + 100; i++) {
      if (i >= descriptors.length) {
        return;
      }
      renderMarker(map, descriptors[i]);
    }
    start = i;
    setTimeout(work, 100);
  }

  setTimeout(work, descriptors.length > 25 ? 1000 : 1);
}


function render(mapEl) {
  var _gm = google.maps, map, data;

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
    styles: maps.styles
  });

  data = getDescriptors();
  map.fitBounds(bounds(data.points) || [[-125.1, 25], [-67, 49.6]]);
  renderAllMarkers(map, data.descriptors);
}

function map() {
  var usMap = document.querySelector('.us-map'),
    stateMap = document.querySelector('.state-map');
  if (usMap || stateMap) {
    maps.init({
      key: dataset(document.body, 'gmapKey'),
      libraries: 'geometry'
    }, render.bind(null, usMap || stateMap));
  }
}

module.exports = map;
