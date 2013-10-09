var loadScript = require('load');
var dataset = require('dataset');

function setParam(key, value) {
  if (value) {
    // if (key === 'developer') {
    //   value = parseInt(value, 10);
    // }
    window['disqus_' + key] = value;
  }
}

function forEachParam(fn) {
  var params = [
    'shortname',
    'identifier',
    'title',
    'url',
    'developer'
  ];

  params.forEach(fn);
}

function disqus(opts) {
  var el = document.getElementById('disqus_thread'), ds;
  if (!el) {
    // nothing to do - no #disqus_thread element
    return;
  }
  ds = dataset(el);
  // copy disqus vars to global namespace, opts values overwrite dataset values
  forEachParam(function(param) {
    setParam(param, ds.get(param));
    if (opts) {
      setParam(param, opts[param]);
    }
  });
  if (!window.disqus_shortname) {
    // at the minimum shortname needs to be defined
    console.err('"shortname" parameter missing.');
    return;
  }

  loadScript('//' + window.disqus_shortname + '.disqus.com/embed.js', true);
}

module.exports = disqus;
