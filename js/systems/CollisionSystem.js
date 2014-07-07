'use strict';

function CollisionSystem() {
  ECS.System.apply(this, [[PositionComponent, BoundingBoxComponent]]);
}
extend(CollisionSystem, ECS.System);

CollisionSystem.prototype.update = function(entities) {
  for (var i = 0; i < entities.length; ++i) {
    if (entities[i].components.hasOwnProperty('CameraComponent')) {
    var position = entities[i].components.PositionComponent.data;
    var boundingBox = entities[i].components.BoundingBoxComponent.data;

      for (var j = 0; j < entities.length; ++j) {
        if (i === j) {
          continue;
        }

        var position2 = entities[j].components.PositionComponent.data;
        var boundingBox2 = entities[j].components.BoundingBoxComponent.data;

        if (position.x > (position2.x + boundingBox2.width)) continue;
        if ((position.x + boundingBox.width) < position2.x) continue;

        if (position.z > (position2.z + boundingBox2.depth)) continue;
        if ((position.z + boundingBox.depth) < position2.z) continue;

        if (position.y > (position2.y + boundingBox2.height)) continue;
        if ((position.y + boundingBox.height) < position2.y) continue;

        var velocity = entities[i].components.VelocityComponent.data;

        velocity.y = 0;
        position.y = position2.y + boundingBox2.height;
      }
    }
  }
}
