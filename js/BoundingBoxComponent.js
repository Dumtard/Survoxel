'use strict';

function BoundingBoxComponent(width, height, depth) {
  ECS.Component.call(this);

  this.data.width = width;
  this.data.height = height;
  this.data.depth = depth;
}
