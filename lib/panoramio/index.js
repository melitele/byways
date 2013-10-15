var jsonp = require('jsonp');
var dataset = require('dataset');
var swipe = require('swipe');
var k = require('k')(window);
var classes = require('classes');

function photos(bounds, fn) {
  jsonp('http://www.panoramio.com/map/get_panoramas.php')
    .query({
      set: 'public',
      from: 0,
      to: 20,
      minx: bounds[0][0],
      miny: bounds[0][1],
      maxx: bounds[1][0],
      maxy: bounds[1][1],
      size: 'medium',
      mapfilter: true
    })
    .end(fn);
}

function link(a, href, text) {
  a.setAttribute('href', href);
  a.innerHTML = text;
}

function renderPhoto(el, photo) {
  el.querySelector('.photo img').setAttribute('src', photo.photo_file_url);
  link(el.querySelector('.caption .author'), photo.owner_url, photo.owner_name);
  link(el.querySelector('.caption .title'), photo.photo_url, photo.photo_title);
  return el;
}

function append(parent, data) {
  var ul = parent.querySelector('ul'),
    template = document.querySelector('.photo-template li'),
    s;

  function next(e) {
    s.stop();
    s.cycle();
    e.preventDefault();
  }
  function prev(e) {
    s.stop();
    if (s.isFirst()) {
      // HACK: better fork and send pull request
      s.currentVisible = s.visible;
    }
    s.prev();
    e.preventDefault();
  }

  data.photos.filter(function(photo) {
    return photo.width === 500 && photo.height === 375;
  }).forEach(function(photo) {
    var li = renderPhoto(template.cloneNode(true), photo);
    ul.appendChild(li);
  });
  if (!ul.childNodes.length) {
    // no photos here
    return;
  }
  s = swipe(parent).interval(7500).duration(750).play();
  k('j', next);
  k('k', prev);

  parent.querySelector('.next').addEventListener('click', next);
  parent.querySelector('.prev').addEventListener('click', prev);

  classes(parent).remove('hidden');
  s.refresh();
  window.addEventListener('resize', function() {
    s.refresh();
  });
}

function getPhotos() {
  var bounds, parent = document.querySelector('.photos[data-bounds]');
  if (!parent) {
    return;
  }
  bounds = dataset(parent, 'bounds');
  if (!bounds) {
    return;
  }
  bounds = JSON.parse(bounds);
  photos(bounds, append.bind(null, parent));
}

module.exports = getPhotos;