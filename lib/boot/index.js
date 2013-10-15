// google-analytics snippet
require('ga')('UA-34953081-6');

// google custom search engine support
require('cse')('016392938617991857370:mvxkyxwnqcw');

// enable disqus
require('disqus')();

// load photos
require('panoramio')();

//load US map
require('us-map')();

function onScrollFn() {
  var header = document.querySelector('body > header');
  return function() {
    if (header.offsetParent) {
      return; // not fixed
    }
    if (window.pageYOffset > 0) {
      header.className = 'over';
    } else {
      header.className = '';
    }
  };
}

// scroll effects
window.addEventListener("scroll", onScrollFn());
