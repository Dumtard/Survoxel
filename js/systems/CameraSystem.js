'use strict';

function CameraSystem() {
  ECS.System.apply(this, ['PositionComponent', 'CameraComponent']);
}
extend(CameraSystem, ECS.System);

CameraSystem.prototype.update = function (entities) {
  for (var i = 0; i < entities.length; ++i) {
    var position = entities[i].components.PositionComponent;
    var camera = entities[i].components.CameraComponent;

    camera.yawObject.position.set(position.x + 0.5, position.y + 1.7,
        position.z + 0.5);
  }
}
