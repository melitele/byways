var loadScript = require('load');

function disqus(opts) {
  // copy disqus vars to global namespace
  Object.keys(opts).forEach(function(key) {
    window['disqus_' + key] = opts[key];
  });

  if (!window.disqus_shortname) {
    // at the minimum shortname needs to be defined
    return;
  }

  loadScript('//' + window.disqus_shortname + '.disqus.com/embed.js', true);
}

module.exports = {
  disqus: disqus
};
