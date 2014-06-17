'use strict';

var ECS = ECS || {};

ECS.Main = function() {
  this.entities = [];
  this.systems = [];
  this.groups = {};
}

ECS.Main.prototype.addSystem = function(system) {
  var name = new String(system.constructor);
  name = name.split(' ')[1].split('(')[0];

  this.systems[name] = system;
}

ECS.Main.prototype.update = function(delta) {
  for (var system in this.systems) {
    var entityList = this.getEntitiesWithComponents(this.systems[system].components);

    if (typeof this.systems[system].begin === "function") {
      this.systems[system].begin();
    }

    this.systems[system].update(entityList, delta);

    if (typeof this.systems[system].end === "function") {
      this.systems[system].end();
    }
  }
}

ECS.Main.prototype.getEntitiesWithComponents = function(components) {
  var entityList = [];
  for (var j = 0; j < this.entities.length; ++j) {
    var containscomponents = 0;
    for (var systemcomponent in components) {
      for (var entitycomponent in this.entities[j].components) {
        if (entitycomponent === systemcomponent) {
          containscomponents++;
          break;
        }
      }
    }
    if (containscomponents === Object.keys(components).length &&
        containscomponents !== 0) {
      entityList.push(this.entities[j]);
    }
  }
  return entityList;
}

ECS.Main.prototype.createEntity = function(group) {
  var length = this.entities.push(new ECS.Entity());

  if (group !== undefined) {
    if (!(group in this.groups)) {
      this.groups[group] = [];
    }
    this.groups[group].push(this.entities[length-1]);
  }

  return this.entities[length-1];
}
