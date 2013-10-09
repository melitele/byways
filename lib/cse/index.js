var load = require('load');

function search(cx) {

  function render() {
    var cse = google.search.cse,
      searchBox = document.getElementById('cseSearchBox'),
      searchResults = document.getElementById('cseSearchResults');

    if (searchBox) {
      cse.element.render({
        div: searchBox,
        tag: 'searchbox-only',
        attributes: {
          resultsUrl: '/search.html'
        }
      });
    }
    if (searchResults) {
      cse.element.render({
        div: searchResults,
        tag: 'searchresults-only',
        attributes: {
          linkTarget: '_top' // open links in the same window
        }
      });
    }
  }

  window.__gcse = {
    parsetags: 'explicit',
    callback: function() {
      if (document.readyState == 'complete') {
        render();
      } else {
        google.setOnLoadCallback(render, true);
      }
    }
  };

  load('//www.google.com/cse/cse.js?cx=' + cx, true);
}

module.exports = search;