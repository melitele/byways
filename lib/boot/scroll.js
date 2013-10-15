var classes = require('classes');

function scroll() {
  var cl = classes(document.body),
    state = {
      top: cl.has('top'),
      bottom: cl.has('bottom')
    };

  function on() {
    var cur = {
      top: window.pageYOffset <= 0,
      bottom: window.pageYOffset + window.innerHeight >= document.body.scrollHeight
    };
    ['bottom', 'top'].forEach(function(prop) {
      if(state[prop] !== cur[prop]) {
        cl.toggle(prop);
        state[prop] = cur[prop];
      }
    });
  }

  window.addEventListener("scroll", on);
}

module.exports = scroll;
