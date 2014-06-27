'use strict';

function Game(width, height) {
  this.canvasWidth = width;
  this.canvasHeight = height;

  this.map = [];
  this.delta = 0;

  this.ecs;
  this.scene;

  this.clock;

  this.factory;
}

Game.prototype.initialize = function() {
  this.ecs = new ECS.Main();
  this.scene = new THREE.Scene();

  this.clock = new THREE.Clock();

  this.factory = new Factory(this);

  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth /
                                           window.innerHeight, 0.1, 10000);
  this.camera.position.set(0, 0, 0);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  this.inputSystem = new InputSystem(this.camera)
  this.ecs.addSystem(this.inputSystem);

  this.scene.add(this.inputSystem.object);
  //this.scene.add(this.camera);

  this.ecs.addSystem(new MovementSystem());
  this.ecs.addSystem(new PositionSystem());
  this.ecs.addSystem(new CameraSystem());
  //this.ecs.addSystem(new GravitySystem());
  //this.ecs.addSystem(new CollisionSystem());

  this.renderer = new WorldRenderSystem(this.canvasWidth, this.canvasHeight,
      this.scene, this.camera);
  this.ecs.addSystem(this.renderer);

  var ambient = new THREE.AmbientLight(0x111111);
  this.scene.add(ambient);

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  this.scene.add(directionalLight);

  for (var i = -1; i < 2; ++i) {
    for (var j = -1; j < 2; ++j) {
      var data = this.factory.generateChunk(i, 0, j);
    }
  }

  this.factory.createPlayer(this.camera);
}

Game.prototype.loop = function() {
  requestAnimationFrame(this.loop.bind(this));

  this.delta = this.clock.getDelta();

  this.ecs.update(this.delta);
}
