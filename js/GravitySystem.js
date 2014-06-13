'use strict';

function GravitySystem() {
  ECS.System.apply(this, [[PositionComponent, VelocityComponent,
      GravityComponent]]);
}
extend(GravitySystem, ECS.System);

GravitySystem.prototype.update = function(entities, delta) {
  for (var i = 0; i < entities.length; ++i) {
    var position = entities[i].components.PositionComponent.data;
    var velocity = entities[i].components.VelocityComponent.data;

    if (velocity.y > -9.8) {
      velocity.y -= 9.8 * delta;
    } else {
      velocity.y = -9.8;
    }
  }
}
