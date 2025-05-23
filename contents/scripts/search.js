// scroll effects
require('hilo')();

const lunr = require('lunr');
const fa = require('fetchagent');
const lunrResultsRender = require('lunr-results-render');

fa.get(document.body.dataset.searchIndex).json().then(search);

/* global URLSearchParams */

function getQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('q');
}

function search(si) {
  const query = getQuery();
  if (!query) {
    return;
  }
  const index = lunr.Index.load(si.index);
  const results = index.search(query);
  lunrResultsRender(results, si.store);
}
