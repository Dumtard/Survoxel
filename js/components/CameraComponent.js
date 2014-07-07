'use strict';

//function CameraComponent(camera) {
//  ECS.Component.call(this);
//
//  this.data.camera = camera;
//  this.data.pitchObject = new THREE.Object3D();
//  this.data.pitchObject.add(this.data.camera);
//  this.data.yawObject = new THREE.Object3D();
//  this.data.yawObject.add(this.data.pitchObject);
//}


var CameraComponent = {
  camera: 0,
  pitchObject: 0,
  yawObject: 0
};
