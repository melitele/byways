const MAX_BOOKS = 3;
const endpoint = document.querySelector('#books-data').dataset.url;

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
  return results.reduce((r, results, i) => {
    results = Array.isArray(results) ? pickRandom(results, list[i].verbatim, slots) : [results];
    results.forEach(book => {
      if (!r.find(b => b.id === book.id || b.title.substring(0, 40) === book.title.substring(0, 40))) {
        r.push(book);
      }
    });
    slots = maxBooks - r.length;
    return r;
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
    parent.classList.remove('hidden');
  }
}

function stateKeywords(state) {
  if (state) {
    return `${state} Byways`;
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
  const maxBooks = parent.dataset.max ?? MAX_BOOKS;
  let list = [];
  const id = parent.dataset.id;
  if (id) {
    list = id.split(',').map(id => ({ id }));
  }
  if (list.length < maxBooks) {
    list = list.concat(
      [
        { keywords: parent.dataset.keywords, verbatim: true },
        { keywords: parent.dataset.name },
        { keywords: stateKeywords(document.querySelector('.byway .state')?.textContent), verbatim: true }
      ].filter(el => el.keywords)
    );

    if (!list.length) {
      return;
    }
  }

  books(list, maxBooks).then(books => {
    append(parent, books);
  });
}

export default fetchBooks;
