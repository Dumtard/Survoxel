'use strict';

function InputSystem(camera) {
  ECS.System.apply(this, [[PositionComponent, InputComponent,
      CameraComponent]]);

  this.camera = camera;

  this.moveForward = false;
  this.moveBackward = false;
  this.moveRight = false;
  this.moveLeft = false;

  window.addEventListener('keydown',
      InputSystem.prototype.keydown.bind(this), false);
  window.addEventListener('keyup',
      InputSystem.prototype.keyup.bind(this), false);
}
extend(InputSystem, ECS.System);

InputSystem.prototype.update = function(entities) {
  for (var i = 0; i < entities.length; ++i) {
    var position = entities[i].components.PositionComponent.data;
    var camera = entities[i].components.CameraComponent.data;

    var direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera.camera.quaternion).normalize();
    direction.multiplyScalar(10);

    if (this.moveForward) {
      position.x += direction.x;
      position.z += direction.z;
    }
    if (this.moveBackward) {
      position.x -= direction.x;
      position.z -= direction.z;
    }
    if (this.moveLeft) {
      direction = direction.cross(camera.camera.up);
      position.x -= direction.x;
      position.z -= direction.z;
    }
    if (this.moveRight) {
      direction = direction.cross(camera.camera.up);
      position.x += direction.x;
      position.z += direction.z;
    }
  }
}

InputSystem.prototype.keydown = function(event) {
  switch (event.keyCode) {
    //W Key
    case 87:
      this.moveForward = true;
      break;

    //S Key
    case 83:
      this.moveBackward = true;
      break;

    //A Key
    case 65:
      this.moveLeft = true;
      break;

    //D Key
    case 68:
      this.moveRight = true;
      break;

    default:
      break;
  }
}

InputSystem.prototype.keyup = function(event) {
  switch (event.keyCode) {
    //W Key
    case 87:
      this.moveForward = false;
      break;

    //S Key
    case 83:
      this.moveBackward = false;
      break;

    //A Key
    case 65:
      this.moveLeft = false;
      break;

    //D Key
    case 68:
      this.moveRight = false;
      break;

    default:
      break;
  }
}
