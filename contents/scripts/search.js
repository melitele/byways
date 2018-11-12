// scroll effects
require('hilo')();

var lunr = require('lunr');
var fa = require('fetchagent');
var lunrResultsRender = require('lunr-results-render');

fa
  .get(document.body.dataset.searchIndex)
  .json()
  .then(search);

/* global URLSearchParams */

function getQuery() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('q');
}

function search(si) {
  var query = getQuery();
  if (!query) {
    return;
  }
  var index = lunr.Index.load(si.index);
  var results = index.search(query);
  lunrResultsRender(results, si.store);
}

