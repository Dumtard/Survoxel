'use strict';

var extend = function(child, base) {
  child.prototype = Object.create(base.prototype);
  child.prototype.constructor = child;
};
