'use strict';

var ECS = ECS || {};

ECS.System = function(components) {
  this.components = {};

  for (var i = 0; i < components.length; ++i) {
    var name = new String(components[i]);
    name = name.split(' ')[1].split('(')[0];

    this.components[name] = components[i];
  }
}
