import fa from 'fetchagent';
import lunr from 'lunr';
import lunrResultsRender from 'lunr-results-render';
import hilo from 'scroll-hilo';

// scroll effects
hilo();

fa.get(document.body.dataset.searchIndex).json().then(search);

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
