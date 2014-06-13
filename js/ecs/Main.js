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
    //Get entities with components
    var entityList = [];

    for (var j = 0; j < this.entities.length; ++j) {
      var containsComponents = 0;
      for (var systemComponent in this.systems[system].components) {
        for (var entityComponent in this.entities[j].components) {
          if (entityComponent === systemComponent) {
            containsComponents++;
            break;
          }
        }
      }
      if (containsComponents === Object.size(this.systems[system].components) &&
          containsComponents !== 0) {
        entityList.push(this.entities[j]);
      }
    }

    if (typeof this.systems[system].begin === "function") {
      this.systems[system].begin();
    }

    this.systems[system].update(entityList, delta);

    if (typeof this.systems[system].end === "function") {
      this.systems[system].end();
    }
  }
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
