'use strict';

var extend = function(child, base) {
  child.prototype = Object.create(base.prototype);
  child.prototype.constructor = child;
};

Object.size = function(obj) {
  //console.log(obj);
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
