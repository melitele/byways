function push(obj, key, val) {
  if (!obj.hasOwnProperty(key)) {
    obj[key] = [];
  }
  obj[key].push(val);
}

function bywaysByDesignation(byways, designations) {
  var other = designations[designations.length - 1];

  designations = designations.reduce(function (result, dsg) {
    result[dsg] = true;
    return result;
  }, {});

  return byways.reduce(function (result, byway) {
    var dsgs = byway.metadata.designations;

    if (!dsgs || !dsgs.length) {
      dsgs = [ other ];
    }

    if (!dsgs.reduce(function (res, dsg) {
      if (designations.hasOwnProperty(dsg)) {
        push(result, dsg, byway);
        return true;
      }
      return res;
    }, false)) {
      push(result, other, byway);
    }
    return result;
  }, {});
}

module.exports = {
  bywaysByDesignation: bywaysByDesignation
};