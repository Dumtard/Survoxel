'use strict';

var Survoxel = Survoxel || {};

function Game(width, height) {
  this.width = width;
  this.height = height;

  this.map = [];
  this.delta = 0;

  this.ecs = new ECS.Main();
  this.scene = new THREE.Scene();

  this.clock = new THREE.Clock();

  this.factory = new Factory(this);
}

Game.prototype.initialize = function() {
  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth /
                                           window.innerHeight, 1, 10000);
  this.camera.position.set(0, 0, 0);

  this.renderer = new WorldRenderSystem(this.width, this.height, this.scene,
      this.camera);

  this.ecs.addSystem(new InputSystem(this.camera, this.clock));

  this.ecs.addSystem(new MovementSystem());
  this.ecs.addSystem(new PositionSystem());
  this.ecs.addSystem(new CameraSystem());
  this.ecs.addSystem(new GravitySystem());
  this.ecs.addSystem(new CollisionSystem());

  this.ecs.addSystem(this.renderer);

  var ambient = new THREE.AmbientLight(0x606060);
  this.scene.add(ambient);

  this.generateMap(32, 32);

  this.factory.createPlayer(this.camera);
}

Game.prototype.loop = function() {
  requestAnimationFrame(this.loop.bind(this));

  this.delta = this.clock.getDelta();

  this.ecs.update(this.delta);
}


function Factory(game) {
  this.game = game;
}

Factory.prototype.createEntity = function(x, y, z, vx, vy, vz) {
  var entity = this.game.ecs.createEntity('entity');

  var renderComponent = new RenderComponent(scene,
      new THREE.BoxGeometry(200, 200, 200),
      new THREE.MeshBasicMaterial({color: 0xff0000}));
  entity.addComponent(renderComponent);
  entity.addComponent(new PositionComponent(x, y, z));
  entity.addComponent(new VelocityComponent(vx, vy, vz));

  return entity;
}

Factory.prototype.createPlayer = function(camera) {
  var entity = this.game.ecs.createEntity('player');

  entity.addComponent(new PositionComponent(0, 500, 0));
  entity.addComponent(new VelocityComponent(0, 0, 0));
  //entity.addComponent(new GravityComponent());
  entity.addComponent(new InputComponent());
  entity.addComponent(new CameraComponent(camera));
  entity.addComponent(new BoundingBoxComponent(100, 100, 100));
}

Game.prototype.generateMap = function(width, length) {
  for (var x = -width/2; x < width/2; ++x) {
    this.map[x] = [];
    for (var y = -length/2; y < length/2; ++y) {
      this.map[x][y] = Math.random();
    }
  }

  this.fillMap(this.map, width, length);
}

Game.prototype.fillMap = function(map, width, length) {
  for (var x = -width/2; x < width/2; ++x) {
    for (var y = -length/2; y < length/2; ++y) {
      var z = Math.round(map[x][y]);

      if (x+1 < 16) {
        var px = Math.round(map[x+1][y]);
      } else {
        var px = 0;
      }
      if (x-1 > -17) {
        var nx = Math.round(map[x-1][y]);
      } else {
        var nx = 0;
      }
      if (y+1 < 16) {
      var py = Math.round(map[x][y+1]);
      } else {
        var py = 0;
      }
      if (y-1 > -17) {
      var ny = Math.round(map[x][y-1]);
      } else {
        var ny = 0;
      }

      if (x+1 < 16 && y+1 < 16)
      var pxpy = Math.round(map[x+1][y+1]);
      if (x+1 < 16 && y-1 > -16)
      var pxny = Math.round(map[x+1][y-1]);
      if (x-1 > -16 && y+1 < 16)
      var nxpy = Math.round(map[x-1][y+1]);
      if (x-1 > -16 && y-1 > -16)
      var nxny = Math.round(map[x-1][y-1]);

      var hasTop = true, hasBottom = false,
          hasFront = false, hasBack = false,
          hasLeft = false, hasRight = false;

      if (px < z) {
        hasFront = true;
      }
      if (nx < z) {
        hasBack = true;
      }

      if (ny < z) {
        hasLeft = true;
      }
      if (py < z) {
        hasRight = true;
      }

      this.factory.createVoxel(100, x*100, z*100, y*100, hasTop, hasBottom,
          hasFront, hasBack, hasLeft, hasRight);
    }
  }
}

Factory.prototype.createVoxel = function(size, x, y, z, hasTop, hasBottom,
    hasFront, hasBack, hasLeft, hasRight) {

  var light = new THREE.Color(0xff0000);
  var light2 = new THREE.Color(0x00ff00);
  var light3 = new THREE.Color(0x0000ff);
  var matrix = new THREE.Matrix4();

  var geometry = new THREE.Geometry();

  if (hasTop) {
    var planetop = new THREE.PlaneGeometry(size, size);
    planetop.faces[0].vertexColors.push(light2, light2, light2);
    planetop.faces[1].vertexColors.push(light2, light2, light2);
    planetop.applyMatrix(matrix.makeRotationX(-Math.PI / 2));
    planetop.applyMatrix(matrix.makeTranslation(size/2, size, size/2));

    geometry.merge(planetop);
  }

  if (hasBottom) {
    var planebottom = new THREE.PlaneGeometry(size, size);
    planebottom.faces[0].vertexColors.push(light, light, light);
    planebottom.faces[1].vertexColors.push(light, light, light);
    planebottom.applyMatrix(matrix.makeRotationX(Math.PI / 2));
    planebottom.applyMatrix(matrix.makeTranslation(0, -size/2, size/2));

    geometry.merge(planebottom);
  }

  if (hasFront) {
    var planefront = new THREE.PlaneGeometry(size, size);
    planefront.faces[0].vertexColors.push(light, light, light);
    planefront.faces[1].vertexColors.push(light, light, light);
    planefront.applyMatrix(matrix.makeRotationY(Math.PI / 2));
    planefront.applyMatrix(matrix.makeTranslation(size, size/2, size/2));

    geometry.merge(planefront);
  }

  if (hasBack) {
    var planeback = new THREE.PlaneGeometry(size, size);
    planeback.faces[0].vertexColors.push(light, light, light);
    planeback.faces[1].vertexColors.push(light, light, light);
    planeback.applyMatrix(matrix.makeRotationY(-Math.PI / 2));
    planeback.applyMatrix(matrix.makeTranslation(0, size/2, size/2));

    geometry.merge(planeback);
  }

  if (hasLeft) {
    var planeleft = new THREE.PlaneGeometry(size, size);
    planeleft.faces[0].vertexColors.push(light, light, light);
    planeleft.faces[1].vertexColors.push(light, light, light);
    planeleft.applyMatrix(matrix.makeRotationY(Math.PI));
    planeleft.applyMatrix(matrix.makeTranslation(size/2, size/2, 0));

    geometry.merge(planeleft);
  }

  if (hasRight) {
    var planeright = new THREE.PlaneGeometry(size, size);
    planeright.faces[0].vertexColors.push(light, light, light);
    planeright.faces[1].vertexColors.push(light, light, light);
    planeright.applyMatrix(matrix.makeTranslation(size/2, size/2, size));

    geometry.merge(planeright);
  }

  var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
    vertexColors: THREE.VertexColors
  }));

  var entity = this.game.ecs.createEntity('voxel');

  var renderComponent = new RenderComponent(this.game.scene, geometry,
      new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors
      }));

  entity.addComponent(renderComponent);
  entity.addComponent(new PositionComponent(x, y, z));
  entity.addComponent(new BoundingBoxComponent(100, 100, 100));

  return entity;
}
