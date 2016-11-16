var dataset = require('dataset');
var classes = require('classes');

/* globals Promise */

var MAX_BOOKS = 3;


function pickRandom(arr, limit) {
  if (limit < 1) {
    return [];
  }
  var maxIndex = arr.length - limit;
  if (maxIndex < 1) {
    return arr;
  }
  var index = Math.floor(Math.random() * maxIndex);
  return arr.slice(index, index + limit);
}

function books(keywordLists) {
  var prefix = 'https://hogfish.code42day.com/api/books?keywords=';

  function fromStringToArray(keywords) {
    return keywords
      .split(/\s+/)
      .filter(function(t) {
        return !/byway|scenic/i.test(t);
      })
      .map(encodeURIComponent).
      join(',');
  }

  return Promise
  .all(
    keywordLists.map(function(keywords) {
      var url = prefix + fromStringToArray(keywords);
      return fetch(url).then(function(res) { return res.json(); });
    })
  )
  .then(function(results) {
    var
      bywayBooks = pickRandom(results[0], MAX_BOOKS - 1),
      stateBooks = pickRandom(results[1], MAX_BOOKS - bywayBooks.length);

    return bywayBooks.concat(stateBooks);
  });
}

function bookImageUrl(book) {
  return 'https://images-na.ssl-images-amazon.com/images/I/' + book.img + '._SX150_.jpg';
}

function renderBook(el, book) {
  var img = el.querySelector('.book img');
  el.querySelector('.book a').setAttribute('href', book.link);
  img.setAttribute('src', bookImageUrl(book));
  img.setAttribute('alt', book.title);
  el.querySelector('figcaption .author').textContent = book.author.join(', ');
  el.querySelector('figcaption .title').textContent = book.title;
  return el;
}

function append(parent, books) {
  var template = document.querySelector('.book-template .book');

  books.forEach(function(book) {
    var figure = renderBook(template.cloneNode(true), book);
    parent.appendChild(figure);
  });
  if (parent.childNodes.length) {
    // books are here!
    classes(parent).remove('hidden');
  }
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
  books([name, state]).then(function(books) {
    append(parent, books);
  });
}

module.exports = fetchBooks;
