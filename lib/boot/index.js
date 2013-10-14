// google-analytics snippet
require('ga')('UA-34953081-6');

// google custom search engine support
require('cse')('016392938617991857370:mvxkyxwnqcw');

// enable disqus
require('disqus')();

//load US map
require('us-map')();

// scroll effects
require('./scroll')();

module.exports = {
  panoramio: require('panoramio')
};
