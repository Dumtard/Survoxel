var ECS = ECS || {};

ECS.Entity = function() {
  this.uuid = uuid.v4();

  this.components = {};
}

ECS.Entity.prototype.addComponent = function(component) {
  if (!component) {
    console.log('No component specified for entity: ' + this.uuid);
    return;
  }

  var name = new String(component.constructor);
  name = name.split(' ')[1].split('(')[0];

  this.components[name] = component;
}

ECS.Entity.prototype.removeComponent = function(component) {
  var name = new String(component);
  name = name.split(' ')[1].split('(')[0];

  if (typeof this.components[name].destroy === "function") {
    this.components[name].destroy();
  }
  delete this.components[name];
}
