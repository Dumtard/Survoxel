'use strict';

function PositionComponent(x, y, z) {
  ECS.Component.call(this);

  this.data.x = x;
  this.data.y = y;
  this.data.z = z;
}
