var dataset = require('dataset');
var swipe = require('swipe');
var k = require('k')(window);
var classes = require('classes');

function photos(bounds, fn) {
  var url = 'https://hogfish.code42day.com/api/poi?provider=photos&limit=3&sw=[sw]&ne=[ne]'
    .replace('[sw]', bounds[0].join(','))
    .replace('[ne]', bounds[1].join(','));

  fetch(url).then(function(res) {
    return res.json();
  }).then(function(photos) {
    fn(photos);
  });
}

function link(a, href, text) {
  a.setAttribute('href', href);
  a.innerHTML = text;
}

function renderPhoto(el, photo) {
  el.querySelector('.photo img').setAttribute('src', photo.urls.regular);
  link(el.querySelector('.caption .author'), photo.author.url, photo.author.name);
  return el;
}

function append(parent, photos) {
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

  photos.forEach(function(photo) {
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
