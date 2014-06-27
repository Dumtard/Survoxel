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
    var entityList = this.getEntitiesWithComponents(
        this.systems[system].components);

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
  for (var i = 0; i < this.entities.length; ++i) {
    var containsComponents = false;
    var systemComponents = Object.keys(components);
    var entityComponents = Object.keys(this.entities[i].components);

    for (var j = 0; j < systemComponents.length; ++j) {
      if (entityComponents.indexOf(systemComponents[j]) === -1) {
        containsComponents = false;
        break;
      } else {
        containsComponents = true;
      }
    }

    if (containsComponents) {
      entityList.push(this.entities[i]);
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
