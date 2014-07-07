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
  //this.ecs = new ECS.Main();
  this.scene = new THREE.Scene();

  this.clock = new THREE.Clock();

  this.factory = new Factory(this);

  //this.scene.fog = new THREE.FogExp2(0x5fa5d8, 0.025);

  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth /
                                           window.innerHeight, 0.1, 10000);
  this.camera.position.set(0, 0, 0);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  this.inputSystem = new InputSystem(this.camera)
  ECS.addSystem(this.inputSystem);

  ECS.addSystem(new MovementSystem());
  ECS.addSystem(new PositionSystem());
  ECS.addSystem(new CameraSystem());
  ECS.addSystem(new ChunkGenerationSystem(this.factory));
  //this.ecs.addSystem(new GravitySystem());
  //this.ecs.addSystem(new CollisionSystem());

  this.renderer = new WorldRenderSystem(this.canvasWidth, this.canvasHeight,
      this.scene, this.camera);
  ECS.addSystem(this.renderer);

  var ambient = new THREE.AmbientLight(0xffffff);
  this.scene.add(ambient);

  var directionalLight = new THREE.DirectionalLight(0x666666);
  directionalLight.position.set(-1, -1, -1).normalize();
  //this.scene.add(directionalLight);

  var player = this.factory.createPlayer(this.camera);
}

Game.prototype.loop = function() {
  requestAnimationFrame(this.loop.bind(this));

  this.delta = this.clock.getDelta();

  ECS.update(this.delta);
}
