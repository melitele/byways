const dataset = require('dataset');
const classes = require('classes');

const MAX_BOOKS = 3;
const endpoint = dataset(document.querySelector('#books-data'), 'url');

function pickRandom(arr, verbatim, limit) {
  if (limit < 1) {
    return [];
  }
  const maxIndex = arr.length - limit;
  if (maxIndex < 1) {
    return arr;
  }
  const index = verbatim ? 0 : Math.floor(Math.random() * maxIndex);
  return arr.slice(index, index + limit);
}

async function books(list, maxBooks = MAX_BOOKS) {
  function fromStringToArray({ keywords, verbatim }) {
    if (verbatim) {
      keywords = keywords.split(',');
    } else {
      keywords = keywords.split(/['()\s]+/).filter(t => t.length > 3 && !/byway|scenic|route|trail/i.test(t));
    }
    return keywords.map(encodeURIComponent).join(',');
  }

  async function doFetch(url) {
    try {
      const res = await fetch(url);
      return await res.json();
    } catch {
      return [];
    }
  }

  const results = await Promise.all(
    list.map(async options =>
      doFetch(endpoint + (options.id ? `?id=${options.id}` : `?keywords=${fromStringToArray(options)}`))
    )
  );

  let slots = maxBooks;
  let rLen = results.length - 1;
  return results.reduce((r, results, i) => {
    results = Array.isArray(results) ? pickRandom(results, list[i].verbatim, slots - rLen) : [results];
    slots = maxBooks - results.length;
    rLen -= 1;
    return r.concat(results);
  }, []);
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
  if (!endpoint) {
    return;
  }
  const parent =
    document.querySelector('.books[data-name]') ||
    document.querySelector('.books[data-keywords]') ||
    document.querySelector('.books[data-id]');
  if (!parent) {
    return;
  }
  let list;
  const id = dataset(parent, 'id');
  if (id) {
    list = id.split(',').map(id => ({ id }));
  } else {
    list = [
      { keywords: dataset(parent, 'keywords'), verbatim: true },
      { keywords: dataset(parent, 'name') },
      { keywords: document.querySelector('.byway .state')?.textContent }
    ].filter(el => el.keywords);

    if (!list.length) {
      return;
    }
  }

  books(list, dataset(parent, 'max')).then(books => {
    append(parent, books);
  });
}

module.exports = fetchBooks;
