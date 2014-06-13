'use strict';

function CollisionSystem() {
  ECS.System.apply(this, [[PositionComponent, BoundingBoxComponent]]);
}
extend(CollisionSystem, ECS.System);

CollisionSystem.prototype.update = function(entities) {
  for (var i = 0; i < entities.length; ++i) {
    var Position = entities[i].components.PositionComponent.data;
    var BoundingBox = entities[i].components.BoundingBoxComponent.data;
  }
  if (Survoxel.game.ecs.groups.hasOwnProperty('player')) {
    for (var i = 0; i < Survoxel.game.ecs.groups.player.length; ++i) {
      Survoxel.game.ecs.groups.player[i]
    }
  }
}
