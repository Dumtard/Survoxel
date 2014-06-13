'use strict';

function CameraSystem() {
  ECS.System.apply(this, [[PositionComponent, CameraComponent]]);
}
extend(CameraSystem, ECS.System);

CameraSystem.prototype.update = function (entities) {
  for (var i = 0; i < entities.length; ++i) {
    var position = entities[i].components.PositionComponent.data;
    var camera = entities[i].components.CameraComponent.data;

    camera.camera.position.set(position.x, position.y, position.z);
  }
}
