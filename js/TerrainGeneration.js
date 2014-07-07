'use strict';

var makeVoxels = function(l, h) {
  var f = function(i,j,k) {
    var h0 = 3.0 * Math.sin(Math.PI * i / 12.0 - Math.PI * k * 0.1) + 27;
    if(j > h0+1) {
      return 0;
    }
    if(h0 <= j) {
      return 0x23dd31;
    }
    var h1 = 2.0 * Math.sin(Math.PI * i * 0.25 - Math.PI * k * 0.3) + 20;
    if(h1 <= j) {
      return 0x964B00;
    }
    if(2 < j) {
      return Math.random() < 0.1 ? 0x222222 : 0xaaaaaa;
    }
    return 0xff0000;
  }

  var v = new Int32Array(h[0]*h[1]*h[2])
    , n = 0;

  for (var z = l[2]; z < l[2] + h[2]; ++z) {
    for (var y = l[1]; y < l[1] + h[1]; ++y) {
      for (var x = l[0]; x < l[0] + h[0]; ++x, ++n) {
        //v[n] = 0x23dd31;
        v[n] = f(x, y, z);
        //v[n] = simplex.noise3D(x, y, z) * 0xffffff;
      }
    }
  }

  return {voxels: v, pos: l, dims: h};
}

var chunkSize = 32;

self.addEventListener('message', function(e) {
  var data = makeVoxels(
      [e.data.x * chunkSize, e.data.y * chunkSize, e.data.z * chunkSize],
      [chunkSize, chunkSize, chunkSize]);

  //var result = greedyMesh(data.voxels, data.pos, data.dims);
  //generateVoxels(result);

  postMessage(data);
}, false);
