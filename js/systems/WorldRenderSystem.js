'use strict';

function WorldRenderSystem(width, height, scene, camera) {
  ECS.System.apply(this, ['RenderComponent']);

  this.scene = scene;
  this.camera = camera;

  this.renderer = new THREE.WebGLRenderer({antialias: true});
  this.renderer.setClearColor(0x82caff);
  this.renderer.setSize(width, height);
  document.body.appendChild(this.renderer.domElement);

  this.renderer.domElement.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  }, false);

  window.addEventListener('resize',
      WorldRenderSystem.prototype.resize.bind(this), false);
}
extend(WorldRenderSystem, ECS.System);

WorldRenderSystem.prototype.update = function(entities) {
  this.renderer.render(this.scene, this.camera);
}

WorldRenderSystem.prototype.resize = function() {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();

  this.renderer.setSize(window.innerWidth, window.innerHeight);
}
