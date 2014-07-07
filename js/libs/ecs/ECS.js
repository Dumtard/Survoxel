'use strict';

var ECS = ECS || {};

ECS.entities = [];
ECS.systems = [];

ECS.createEntity = function(group) {
  this.entities.push(new ECS.Entity());

  return _.last(this.entities);
};

ECS.addSystem = function(system) {
  this.systems.push(system);
};

ECS.update = function(delta) {
  for (var i = 0; i < this.systems.length; ++i) {
    var entityList = this.getEntities(this.systems[i].components);

    if (typeof this.systems[i].begin === "function") {
      this.systems[i].begin();
    }

    this.systems[i].update(entityList, delta);

    if (typeof this.systems[i].end === "function") {
      this.systems[i].end();
    }
  }
};

ECS.getEntities = function(components) {
  var entities = [];

  for (var i = 0; i < this.entities.length; ++i) {
    if (_.intersection(Object.keys(this.entities[i].components),
          components).length === components.length) {
      entities.push(this.entities[i]);
    }
  }

  return entities;
};

ECS.Entity = function() {
  this.uuid = uuid.v4();

  this.components = {};
};

ECS.Entity.prototype.addComponent = function(component) {
  var name = _.first(component);

  if (_.isEqual(Object.keys(window[name]), Object.keys(_.last(component)))) {
    this.components[name] = _.last(component);

    return this.components[name];
  }
  console.log('Component ' + name + ' does not have the correct properties');
  return undefined;
};

ECS.Entity.prototype.removeComponent = function(component) {
  delete this.components[component];
};

ECS.System = function() {
  this.components = [];

  for (var i = 0; i < arguments.length; ++i) {
    this.components.push(arguments[i]);
  }
};
