'use strict';

function PositionSystem() {
  ECS.System.apply(this, [[RenderComponent, PositionComponent]])
}
extend(PositionSystem, ECS.System);

PositionSystem.prototype.update = function(entities) {
  for (var i = 0; i < entities.length; ++i) {
    var position = entities[i].components.PositionComponent.data;
    var model = entities[i].components.RenderComponent.data;

    model.mesh.position.set(position.x, position.y, position.z);
  }
}
