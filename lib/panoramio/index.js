var jsonp = require('jsonp');

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

function photo2img(parent, photo) {
  var img = document.createElement('img');
  img.src = photo.photo_file_url;
  parent.appendChild(img);
}

function link(a, href, text) {
  a.setAttribute('href', href);
  a.innerHTML = text;
}

function renderPhoto(el, photo) {
  el.querySelector('.photo img').setAttribute('src', photo.photo_file_url);
  link(el.querySelector('.caption .author'), photo.owner_url, photo.owner_name);
  link(el.querySelector('.caption .title'), photo.photo_url, photo.photo_title);
  el.setAttribute('display', 'block');
}

var counter = 0;

function getPhoto(photos) {
  var index = Math.floor(Math.random() * photos.length);
  return photos[index];
}


function append(parent, bounds) {
  photos(bounds, function(data) {
    console.log(data);
    renderPhoto(parent, getPhoto(data.photos));
  });
}

module.exports = append;