'use strict';

function InputSystem(camera) {
  ECS.System.apply(this, [[PositionComponent, InputComponent,
      CameraComponent]]);

  this.camera = camera;

  this.moveForward = false;
  this.moveBackward = false;
  this.moveRight = false;
  this.moveLeft = false;

  this.mouse = {x: 0, y: 0};
  this.mouseRest = {x: window.innerWidth / 2, y: window.innerHeight / 2};
  this.lat = 0;
  this.lon = 0;
  this.theta = 0;
  this.phi = 0;
  this.target = new THREE.Vector3(0, 0, 0);
  this.timer = false;

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
    var position = entities[i].components.PositionComponent.data;
    var camera = entities[i].components.CameraComponent.data;

    var direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera.camera.quaternion).normalize();
    direction.multiplyScalar(500);

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
  }

  var actualLookSpeed = delta * 20;
  var verticalLookRatio = 1;

  this.lon += this.mouse.x * actualLookSpeed;
  this.lat -= this.mouse.y * actualLookSpeed * verticalLookRatio;

  if (this.mouse.x = 0) {
    this.lon = 0;
  }
  if (this.mouse.y = 0) {
    this.lat = 0;
  }

  this.lat = Math.max(- 85, Math.min(85, this.lat));
  this.phi = THREE.Math.degToRad(90 - this.lat);

  this.theta = THREE.Math.degToRad(this.lon);

  position = camera.camera.position;

  this.target.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
  this.target.y = position.y + 100 * Math.cos(this.phi);
  this.target.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

  camera.camera.lookAt(this.target);
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

  if (this.timer) {
    window.clearTimeout(this.timer);
  }

  this.timer = window.setTimeout(function() {
    this.mouse.x = 0;
    this.mouse.y = 0;

    this.mouseRest.x = event.pageX;
    this.mouseRest.y = event.pageY;
  }.bind(this), 100);

  if (this.mouse.x < -80) {
    this.mouse.x = -80;
  } else if (this.mouse.x > 80) {
    this.mouse.x = 80;
  }

  if (this.mouse.y < -80) {
    this.mouse.y = -80;
  } else if (this.mouse.y > 80) {
    this.mouse.y = 80;
  }
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
    document.body.mozPointerLockElement;
    document.body.webkitPointerLockElement;
  } else {
  }
}
