import * as THREE from 'three';

function CreateCustomGeometry(radius = 1) {
  const phi = (1 + Math.sqrt(5)) / 2;

  // 12 unique vertices (before normalization)
  const V = [
    new THREE.Vector3(-1,  phi,  0),
    new THREE.Vector3( 1,  phi,  0),
    new THREE.Vector3(-1, -phi,  0),
    new THREE.Vector3( 1, -phi,  0),

    new THREE.Vector3( 0, -1,  phi),
    new THREE.Vector3( 0,  1,  phi),
    new THREE.Vector3( 0, -1, -phi),
    new THREE.Vector3( 0,  1, -phi),

    new THREE.Vector3( phi,  0, -1),
    new THREE.Vector3( phi,  0,  1),
    new THREE.Vector3(-phi,  0, -1),
    new THREE.Vector3(-phi,  0,  1),
  ].map(v => v.normalize().multiplyScalar(radius));

  // 20 triangular faces (indices into V)
  const F = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  // Non-indexed: 20 faces * 3 verts = 60 vertices
  const positions = new Float32Array(F.length * 3 * 3);
  const colors    = new Float32Array(F.length * 3 * 3);

  const color = new THREE.Color();
  let p = 0;
  let c = 0;

  const colorDepth = 6/10;

  for (let f = 0; f < F.length; f++) {
    // random per face
    color.setRGB(Math.random() /* Idk I just really like this */, Math.random()/2 + 0.2, Math.random()/2 + 0.2);

    const [a, b, d] = F[f]; // (a,b,c) but using d name to avoid confusion with color array index
    const tri = [V[a], V[b], V[d]];

    for (let i = 0; i < 3; i++) {
      const v = tri[i];

      positions[p++] = v.x;
      positions[p++] = v.y;
      positions[p++] = v.z;

      colors[c++] = color.r;
      colors[c++] = color.g;
      colors[c++] = color.b;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  geometry.computeVertexNormals();

  geometry.userData.targetPositions = positions.slice();

  return geometry;
}

export { CreateCustomGeometry };