function Factory(game) {
  this.game = game;

  this.chunk = {
    x: undefined,
    y: undefined,
    z: undefined
  };

  this.loadedChunks = [];
}

Factory.prototype.createEntity = function(x, y, z, vx, vy, vz) {
  var entity = ECS.createEntity('entity');

  var renderComponent = new RenderComponent(scene,
      new THREE.BoxGeometry(200, 200, 200),
      new THREE.MeshBasicMaterial({color: 0xff0000}));
  entity.addComponent(renderComponent);
  entity.addComponent(new PositionComponent(x, y, z));
  entity.addComponent(new VelocityComponent(vx, vy, vz));

  return entity;
}

Factory.prototype.createPlayer = function(camera) {
  var entity = ECS.createEntity('player');

  entity.addComponent(['PositionComponent', {x: 16, y: 30, z: 16}]);
  entity.addComponent(['VelocityComponent', {x: 0, y: 0, z: 0}]);
  //entity.addComponent(['GravityComponent', {x: 0, y: 0, z: 0}]);
  entity.addComponent(['InputComponent', {}]);
  var pitchObject = new THREE.Object3D();
  pitchObject.add(camera);
  var yawObject = new THREE.Object3D();
  yawObject.add(pitchObject);
  this.game.scene.add(yawObject);
  entity.addComponent(['CameraComponent', {camera: camera,
    pitchObject: pitchObject, yawObject: yawObject}]);
  //entity.addComponent(['BoundingBoxComponent', {x: 0, y: 0, z: 0}]);


  //entity.addComponent(new PositionComponent(16, 30, 16));
  //entity.addComponent(new VelocityComponent(0, 0, 0));
  //entity.addComponent(new GravityComponent());
  //entity.addComponent(new InputComponent());

  //var cameraComponent = new CameraComponent(camera);
  //this.game.scene.add(cameraComponent.data.yawObject);
  //entity.addComponent(cameraComponent);

  //entity.addComponent(new BoundingBoxComponent(0.25, 1, 0.25));

  return entity;
}

Factory.prototype.generateChunk = function(x, y, z) {
  if (this.chunk.x === x && this.chunk.y === y && this.chunk.z === z) {
    return;
  } else {
    this.chunk.x = x;
    this.chunk.y = y;
    this.chunk.z = z;
  }

  for (var x = this.chunk.x-1; x <= this.chunk.x+1; ++x) {
    for (var y = this.chunk.y-1; y <= this.chunk.y+1; ++y) {
      for (var z = this.chunk.z-1; z <= this.chunk.z+1; ++z) {
        var loaded = false;

        for (var i = 0; i < this.loadedChunks.length; ++i) {
          if (this.loadedChunks[i].x === x &&
              this.loadedChunks[i].y === y &&
              this.loadedChunks[i].z === z) {
            loaded = true;
            break;
          }
        }
        if(loaded) {
          break;
        } else {
          var worker = new Worker('js/TerrainGeneration.js');

          worker.onmessage = function(e) {
            var result = this.greedyMesh(e.data.voxels, e.data.pos, e.data.dims);
            this.generateVoxels(result);
          }.bind(this);

          worker.postMessage({x: x, y: y, z: z});
        }
      }
    }
  }
}

Factory.prototype.greedyMesh = (function() {
//Cache buffer internally
var mask = new Int32Array(4096);

return function(volume, pos, dims) {
  function f(i,j,k) {
    return volume[i + dims[0] * (j + dims[1] * k)];
  }

  var vertices = [], faces = [], uvs = [], mats = [];

  //Sweep over 3-axes
  for(var d = 0; d < 3; ++d) {
    var u = (d+1)%3
      , v = (d+2)%3
      , x = [0,0,0]
      , q = [0,0,0];

    if(mask.length < dims[u] * dims[v]) {
      mask = new Int32Array(dims[u] * dims[v]);
    }

    q[d] = 1;

    for(x[d] = -1; x[d] < dims[d];) {
      var n = 0;

      //Compute mask
      for(x[v]=0; x[v]<dims[v]; ++x[v]) {
        for(x[u]=0; x[u]<dims[u]; ++x[u], ++n) {
          var a = (0    <= x[d]      ? f(x[0],      x[1],      x[2])      : 0)
            , b = (x[d] <  dims[d]-1 ? f(x[0]+q[0], x[1]+q[1], x[2]+q[2]) : 0);

          if((!!a) === (!!b) ) {
            mask[n] = 0;
          } else if(!!a) {
            mask[n] = a;
          } else {
            mask[n] = -b;
          }
        }
      }

      //Increment x[d]
      ++x[d];

      n = 0;

      //Generate mesh for mask using lexicographic ordering
      for(var j = 0; j < dims[v]; ++j) {
        for(var i = 0; i < dims[u]; ) {
          var c = mask[n];
          if(!!c) {
            var w;
            var h;
            //Compute width
            for(w=1; c === mask[n+w] && i+w<dims[u]; ++w) {
            }

            //Compute height (this is slightly awkward)
            var done = false;
            for(h = 1; j+h < dims[v]; ++h) {
              for(var k = 0; k < w; ++k) {
                if(c !== mask[n+k+h*dims[u]]) {
                  done = true;
                  break;
                }
              }
              if(done) {
                break;
              }
            }

            //Add quad
            x[u] = i;
            x[v] = j;

            var du = [0,0,0]
              , dv = [0,0,0];

            if(c > 0) {
              dv[v] = h;
              du[u] = w;
            } else {
              c = -c;
              du[v] = h;
              dv[u] = w;
            }

            var x2 = x.concat();
            x2[0] += pos[0];
            x2[1] += pos[1];
            x2[2] += pos[2];

            var vertex_count = vertices.length;

            vertices.push(new THREE.Vector3(
                  x2[0],
                  x2[1],
                  x2[2]));

            vertices.push(new THREE.Vector3(
                  x2[0] + du[0],
                  x2[1] + du[1],
                  x2[2] + du[2]));

            vertices.push(new THREE.Vector3(
                x2[0] + du[0] + dv[0],
                x2[1] + du[1] + dv[1],
                x2[2] + du[2] + dv[2]));

            vertices.push(new THREE.Vector3(
                x2[0] + dv[0],
                x2[1] + dv[1],
                x2[2] + dv[2]));

            var vector1 = new THREE.Vector3().
              subVectors(vertices[vertex_count+1], vertices[vertex_count]);
            var vector2 = new THREE.Vector3().
              subVectors(vertices[vertex_count+1], vertices[vertex_count+2]);

            var normal = new THREE.Vector3();
            normal.crossVectors(vector1, vector2);

            if (d === 0) {
              if (normal.x < 0) {
                uvs.push([new THREE.Vector2(dv[2],0),
                          new THREE.Vector2(dv[2],du[1]),
                          new THREE.Vector2(0,du[1])]);
                uvs.push([new THREE.Vector2(dv[2],0),
                          new THREE.Vector2(0,du[1]),
                          new THREE.Vector2(0,0)]);

                faces.push([vertex_count, vertex_count+1, vertex_count+2, c]);
                faces.push([vertex_count, vertex_count+2, vertex_count+3, c]);
              } else if (normal.x > 0) {
                uvs.push([new THREE.Vector2(du[2],0),
                          new THREE.Vector2(du[2],dv[1]),
                          new THREE.Vector2(0,dv[1])]);
                uvs.push([new THREE.Vector2(du[2],0),
                          new THREE.Vector2(0,dv[1]),
                          new THREE.Vector2(0,0)]);

                faces.push([vertex_count+1, vertex_count+2, vertex_count+3, c]);
                faces.push([vertex_count+1, vertex_count+3, vertex_count, c]);
              }
              mats.push(1);
              mats.push(1);
            }
            if (d === 1) {
              if (normal.y < 0) {
                uvs.push([new THREE.Vector2(dv[0],0),
                          new THREE.Vector2(dv[0],du[2]),
                          new THREE.Vector2(0,du[2])]);
                uvs.push([new THREE.Vector2(dv[0],0),
                          new THREE.Vector2(0,du[2]),
                          new THREE.Vector2(0,0)]);

                faces.push([vertex_count, vertex_count+1, vertex_count+2, c]);
                faces.push([vertex_count, vertex_count+2, vertex_count+3, c]);
              } else if (normal.y > 0) {
                uvs.push([new THREE.Vector2(dv[0],0),
                          new THREE.Vector2(dv[0],du[2]),
                          new THREE.Vector2(0,du[2])]);
                uvs.push([new THREE.Vector2(dv[0],0),
                          new THREE.Vector2(0,du[2]),
                          new THREE.Vector2(0,0)]);

                faces.push([vertex_count+1, vertex_count+2, vertex_count+3, c]);
                faces.push([vertex_count+1, vertex_count+3, vertex_count, c]);
              }
              mats.push(0);
              mats.push(0);
            }
            if (d === 2) {
              if (normal.z > 0) {
                uvs.push([new THREE.Vector2(dv[0], 0),
                          new THREE.Vector2(dv[0], du[1]),
                          new THREE.Vector2(0,     du[1])]);
                uvs.push([new THREE.Vector2(dv[0], 0),
                          new THREE.Vector2(0,     du[1]),
                          new THREE.Vector2(0,     0)]);

                faces.push([vertex_count, vertex_count+1, vertex_count+2, c]);
                faces.push([vertex_count, vertex_count+2, vertex_count+3, c]);
              } else if (normal.z < 0) {
                uvs.push([new THREE.Vector2(du[0], 0),
                          new THREE.Vector2(du[0], dv[1]),
                          new THREE.Vector2(0,     dv[1])]);
                uvs.push([new THREE.Vector2(du[0], 0),
                          new THREE.Vector2(0,     dv[1]),
                          new THREE.Vector2(0,     0)]);

                faces.push([vertex_count+1, vertex_count+2, vertex_count+3, c]);
                faces.push([vertex_count+1, vertex_count+3, vertex_count, c]);
              }
              mats.push(1);
              mats.push(1);
            }

            //Zero-out mask
            for(var l = 0; l < h; ++l) {
              for(var k = 0; k < w; ++k) {
                mask[n+k+l*dims[u]] = 0;
              }
            }

            //Increment counters and continue
            i += w;
            n += w;
          } else {
            ++i;
            ++n;
          }
        }
      }
    }
  }
  return { vertices:vertices, faces:faces, uvs:uvs, mats: mats };
}
})();


Factory.prototype.generateVoxels = function (result) {
  var geometry = new THREE.Geometry();

  for(var i = 0; i < result.vertices.length; ++i) {
    var q = result.vertices[i];
    geometry.vertices.push(q);
  }

  for(var i = 0; i < result.faces.length; ++i) {
    var q = result.faces[i];

    var f = new THREE.Face3(q[0], q[1], q[2]);
    f.color = new THREE.Color(q[3]);
    f.vertexColors = [f.color, f.color, f.color];
    f.materialIndex = result.mats[i];
    geometry.faces.push(f);
  }

  geometry.faceVertexUvs[0] = result.uvs.concat();

  geometry.computeFaceNormals();

  geometry.verticesNeedUpdate = true;
  geometry.elementsNeedUpdate = true;
  geometry.uvsNeedUpdate = true;

  var grassTop = THREE.ImageUtils.loadTexture('resources/tiles/grass/top.png');
  grassTop.minFilter = grassTop.magFilter = THREE.NearestFilter;
  grassTop.wrapS = grassTop.wrapT = THREE.RepeatWrapping;

  var grassSide = THREE.ImageUtils.loadTexture('resources/tiles/grass/side.png');
  grassSide.minFilter = grassSide.magFilter = THREE.NearestFilter;
  grassSide.wrapS = grassSide.wrapT = THREE.RepeatWrapping;

  var materials = [new THREE.MeshPhongMaterial({
    map: grassTop
  }),
  new THREE.MeshPhongMaterial({
    map: grassSide
  })];

  var surfaceMesh = new THREE.Mesh(geometry,
      new THREE.MeshFaceMaterial(materials));

  surfaceMesh.doubleSided = false;
  var wirematerial = new THREE.MeshBasicMaterial({
      color : 0x000000
    , wireframe : true
  });
  var wireMesh = new THREE.Mesh(geometry, wirematerial);
  wireMesh.doubleSided = false;

  this.game.scene.add(surfaceMesh);
  //this.game.scene.add(wireMesh);
}

