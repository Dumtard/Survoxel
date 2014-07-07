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

    if (velocity.y > -98) {
      velocity.y -= 98 * delta;
    } else {
      velocity.y = -98;
    }
  }
}
