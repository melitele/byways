function load(src, async) {
  var parent, s = document.createElement('script');
  if (async) {
    s.async = true;
  }
  s.type = 'text/javascript';
  s.src = src;
  parent = document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0];
  parent.appendChild(s);
}


module.exports = load;
