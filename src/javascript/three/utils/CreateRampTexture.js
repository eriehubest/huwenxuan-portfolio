import * as THREE from "three";

export function createSectionalRampTexture() {
  const width = 256;
  const height = 1;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, width, 0);

  // ---- SHADOWS ----
  grad.addColorStop(0.00, "#0b0b0b"); // deep shadow
  grad.addColorStop(0.18, "#0b0b0b");

  grad.addColorStop(0.18, "#242424"); // mid shadow
  grad.addColorStop(0.42, "#242424");

  // ---- BASE LIT ----
  grad.addColorStop(0.42, "#6a6a6a");
  grad.addColorStop(0.65, "#6a6a6a");

  // ---- KEY LIGHT ----
  grad.addColorStop(0.65, "#bdbdbd");
  grad.addColorStop(0.80, "#bdbdbd");

  // ---- SPEC STRIP ----
  grad.addColorStop(0.80, "#ffffff");
  grad.addColorStop(0.92, "#ffffff");

  // ---- ROLLOFF ----
  grad.addColorStop(0.92, "#e0e0e0");
  grad.addColorStop(1.00, "#e0e0e0");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  // IMPORTANT for ramps
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;

  return tex;
}