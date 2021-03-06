'use strict';

function MovementSystem() {
  ECS.System.apply(this, ['PositionComponent', 'VelocityComponent']);
}
extend(MovementSystem, ECS.System);

MovementSystem.prototype.update = function(entities) {
  for (var i = 0; i < entities.length; ++i) {
    var position = entities[i].components.PositionComponent;
    var velocity = entities[i].components.VelocityComponent;

    position.x += velocity.x;
    position.y += velocity.y;
    position.z += velocity.z;
  }
}
