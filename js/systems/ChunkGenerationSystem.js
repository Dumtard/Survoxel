'use strict';

function ChunkGenerationSystem(factory) {
  ECS.System.apply(this, ['CameraComponent', 'PositionComponent']);

  this.factory = factory;
}
extend(ChunkGenerationSystem, ECS.System);

ChunkGenerationSystem.prototype.update = function(entities) {
  for (var i = 0; i < entities.length; ++i) {
    var position = entities[i].components.PositionComponent;

    var chunk = {
      x: Math.floor(position.x / 32),
      y: Math.floor(position.y / 32),
      z: Math.floor(position.z / 32)
    }

    var data = this.factory.generateChunk(0, 0, 0);
  }
}
