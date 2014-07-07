'use strict';

function InputSystem(camera) {
  ECS.System.apply(this, ['PositionComponent', 'InputComponent',
      'CameraComponent']);

  this.moveForward = false;
  this.moveBackward = false;
  this.moveRight = false;
  this.moveLeft = false;

  this.mouse = {x: 0, y: 0};
  this.mouseStop;

  window.addEventListener('keydown',
      InputSystem.prototype.keydown.bind(this), false);
  window.addEventListener('keyup',
      InputSystem.prototype.keyup.bind(this), false);
  window.addEventListener('mousemove',
      InputSystem.prototype.mousemove.bind(this), false);

  window.addEventListener('pointerlockchange',
      InputSystem.prototype.pointerlockchange.bind(this), false);
  window.addEventListener('mozpointerlockchange',
      InputSystem.prototype.pointerlockchange.bind(this), false);
  window.addEventListener('webkitpointerlockchange',
      InputSystem.prototype.pointerlockchange.bind(this), false);
}
extend(InputSystem, ECS.System);

InputSystem.prototype.update = function(entities, delta) {
  for (var i = 0; i < entities.length; ++i) {
    var position = entities[i].components.PositionComponent;
    var camera = entities[i].components.CameraComponent;

    var direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera.yawObject.quaternion).normalize();
    direction.multiplyScalar(5);

    if (this.moveForward) {
      position.x += delta * direction.x;
      position.z += delta * direction.z;
    }
    if (this.moveBackward) {
      position.x -= delta * direction.x;
      position.z -= delta * direction.z;
    }
    if (this.moveLeft) {
      direction = direction.cross(camera.camera.up);
      position.x -= delta * direction.x;
      position.z -= delta * direction.z;
    }
    if (this.moveRight) {
      direction = direction.cross(camera.camera.up);
      position.x += delta * direction.x;
      position.z += delta * direction.z;
    }

    camera.yawObject.rotation.y -= this.mouse.x * delta;
    camera.pitchObject.rotation.x -= this.mouse.y * delta;

    camera.pitchObject.rotation.x = Math.max(-Math.PI/2,
        Math.min(Math.PI/2, camera.pitchObject.rotation.x));
  }
}

InputSystem.prototype.keydown = function(event) {
  ptrLock(document.body);

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

InputSystem.prototype.mousemove = function(event) {
  this.mouse.x = event.movementX || event.mozMovementX ||
    event.webkitMovementX || 0;
  this.mouse.y = event.movementY || event.mozMovementY ||
    event.webkitMovementY || 0;

  if (this.mouse.x > 20) {
    this.mouse.x = 20;
  }
  if (this.mouse.x < -20) {
    this.mouse.x = -20;
  }

  if (this.mouseStop) {
    window.clearTimeout(this.mouseStop);
  }

  this.mouseStop = setTimeout(function() {
    this.mouse.x = 0;
    this.mouse.y = 0;
  }.bind(this), 10);
}

function ptrLock(c) {
  c.requestPointerLock = c.requestPointerLock ||
                         c.mozRequestPointerLock ||
                         c.webkitRequestPointerLock;

  c.requestPointerLock();
}

InputSystem.prototype.pointerlockchange = function(event) {
  if (document.body.pointerLockElement === document.body ||
      document.body.mozpointerLockElement === document.body ||
      document.body.webkickPointerLockElement === document.body) {
    document.body.style.cursor = 'none';
  }
}
