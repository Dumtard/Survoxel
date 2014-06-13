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

    if (this.moveForward) {
      position.x += 5;
    }
    if (this.moveBackward) {
      position.x -= 5;
    }
    if (this.moveLeft) {
      position.z += 5;
    }
    if (this.moveRight) {
      position.z -= 5;
    }
  }
}

InputSystem.prototype.keydown = function(event) {
  switch (event.keyCode) {
    // W Key
    case 87:
      this.moveForward = true;
      break;

    //S Key
    case 83:
      this.moveBackward = true;
      break;

    //A Key
    case 65:
      this.moveRight = true;
      break;

    //F Key
    case 68:
      this.moveLeft = true;
      break;

    default:
      break;
  }
}

InputSystem.prototype.keyup = function(event) {
  switch (event.keyCode) {
    // W Key
    case 87:
      this.moveForward = false;
      break;

    //S Key
    case 83:
      this.moveBackward = false;
      break;

    //A Key
    case 65:
      this.moveRight = false;
      break;

    //F Key
    case 68:
      this.moveLeft = false;
      break;

    default:
      break;
  }
}
