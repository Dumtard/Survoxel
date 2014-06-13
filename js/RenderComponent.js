'use strict';

function RenderComponent(scene, geometry, material) {
  ECS.Component.call(this);

  this.data.geometry = geometry;
  this.data.material = material;
  this.data.mesh = new THREE.Mesh(this.data.geometry, this.data.material);

  scene.add(this.data.mesh);
  scene.updateMatrixWorld(true);
}
