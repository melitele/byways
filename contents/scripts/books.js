var dataset = require('dataset');
var swipe = require('swipe');
var k = require('k')(window);
var classes = require('classes');

/* globals Promise */

function books(name, state, fn) {
  var prefix = 'https://hogfish.code42day.com/api/books?keywords=';

  name = name.split(/\s+/)
    .filter(function(t) {
      return !/byway|scenic/i.test(t);
    })
    .map(encodeURIComponent).
    join(',');

  state = encodeURIComponent(state);

  Promise.all(
    [
      prefix + name,
      prefix + state
    ]
    .map(function (url) {
      return fetch(url)
        .then(function(res) { return res.json(); });
    })
  )
  .then(function(results) {
    fn(results[0].concat(results[1]));
  });
}

function bookImageUrl(book, size) {
  size = size || 'SX250';
  return 'https://images-na.ssl-images-amazon.com/images/I/' + book.img + '._' + size + '_.jpg';
}

function renderBook(el, book) {
  el.querySelector('.book a').setAttribute('href', book.link);
  el.querySelector('.book img').setAttribute('src', bookImageUrl(book));
  el.querySelector('figcaption .author').textContent = book.author.join(', ');
  el.querySelector('figcaption .title').textContent = book.title;
  return el;
}

function append(parent, books) {
  var ul = parent.querySelector('ul'),
    template = document.querySelector('.book-template li'),
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

  books.forEach(function(book) {
    var li = renderBook(template.cloneNode(true), book);
    ul.appendChild(li);
  });
  if (!ul.childNodes.length) {
    // no books here
    return;
  }
  s = swipe(parent).interval(10000).duration(750).play();
  k('j', next);
  k('k', prev);

  classes(parent).remove('hidden');
  s.refresh();
  window.addEventListener('resize', function() {
    s.refresh();
  });
}

function fetchBooks() {
  var name, state, parent = document.querySelector('.books[data-name]');
  if (!parent) {
    return;
  }
  name = dataset(parent, 'name');
  state = document.querySelector('.byway .state').textContent;
  if (!name) {
    return;
  }
  books(name, state, append.bind(null, parent));
}

module.exports = fetchBooks;
