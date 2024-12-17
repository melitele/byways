const dataset = require('dataset');
const classes = require('classes');

const MAX_BOOKS = 3;

function pickRandom(arr, limit) {
  if (limit < 1) {
    return [];
  }
  const maxIndex = arr.length - limit;
  if (maxIndex < 1) {
    return arr;
  }
  const index = Math.floor(Math.random() * maxIndex);
  return arr.slice(index, index + limit);
}

async function books(keywordLists) {
  const prefix = 'https://hogfish.code42day.com/api/books?keywords=';

  function fromStringToArray(keywords) {
    return keywords
      .split(/['()\s]+/)
      .filter(t => t.length > 3 && !/byway|scenic|route|trail/i.test(t))
      .map(encodeURIComponent)
      .join(',');
  }

  const results = await Promise.all(
    keywordLists.map(async (keywords) => {
      const url = prefix + fromStringToArray(keywords);
      try {
        const res = await fetch(url);
        return await res.json();
      } catch {
        return [];
      }
    })
  );

  const bywayBooks = pickRandom(results[0], MAX_BOOKS - 1);
  const stateBooks = pickRandom(results[1], MAX_BOOKS - bywayBooks.length);

  return bywayBooks.concat(stateBooks);
}

function bookImageUrl(book) {
  return `https://images-na.ssl-images-amazon.com/images/I/${book.img}._SX150_.jpg`;
}

function renderBook(el, book) {
  const img = el.querySelector('.book img');
  el.querySelector('.book a').setAttribute('href', book.link);
  img.setAttribute('src', bookImageUrl(book));
  img.setAttribute('alt', book.title);
  el.querySelector('figcaption .author').textContent = book.author.join(', ');
  el.querySelector('figcaption .title').textContent = book.title;
  return el;
}

function append(parent, books) {
  const template = document.querySelector('.book-template .book');

  books.forEach(book => {
    const figure = renderBook(template.cloneNode(true), book);
    parent.appendChild(figure);
  });
  if (parent.childNodes.length) {
    // books are here!
    classes(parent).remove('hidden');
  }
}

function fetchBooks() {
  const parent = document.querySelector('.books[data-name]');
  if (!parent) {
    return;
  }
  const name = dataset(parent, 'name');
  const state = document.querySelector('.byway .state').textContent;
  if (!name) {
    return;
  }
  books([name, state]).then(books => {
    append(parent, books);
  });
}

module.exports = fetchBooks;
