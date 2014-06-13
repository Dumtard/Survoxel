'use strict';

var ECS = ECS || {};

ECS.Groups = function() {
  this.groups = {};
}

ECS.Groups.prototype.add = function(group, entity) {
  if (!(group in this.groups)) {
    this.groups[group] = [];
  }
  this.groups[group].push(entity);
}
