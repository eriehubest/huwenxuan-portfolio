import * as THREE from "three";
import gsap from "gsap";
import { MeshStandardNodeMaterial } from "three/webgpu";
import {
    attribute, time, sin, vec3,
    clamp, pow, max, dot,
    normalView, positionViewDirection,
    float, uniform, mix,
} from "three/tsl";

import { CreateCustomGeometry } from "./Geometry";
import Application from "../application";
import AnimationTracker from "../AnimationTracker";
import { createSectionalRampTexture } from "../utils/CreateRampTexture";

function buildFacePlaneStartPositions(geometry, mesh, camera, {
    planeOffset = 0.0,
    spread = 2.2,
    depthJitter = 0.35,
    roll = Math.PI * 0.65,
} = {}) {
    const posAttr = geometry.getAttribute("position");
    // console.log(posAttr)
    const target = geometry.userData.targetPositions;
    const out = posAttr.array;

    // camera basis (WORLD)
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir).normalize();
    const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
    const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();

    // plane center (WORLD)
    const planeCenter = new THREE.Vector3();
    mesh.getWorldPosition(planeCenter);
    planeCenter.addScaledVector(camDir, planeOffset);

    const faceCount = out.length / 9;

    const rng01 = (i) => {
        const x = Math.sin(i * 999.123) * 43758.5453;
        return x - Math.floor(x);
    };
    const rng11 = (i) => rng01(i) * 2 - 1;

    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    const centroid = new THREE.Vector3();
    const u = new THREE.Vector3(), v = new THREE.Vector3(), n = new THREE.Vector3();
    const ca = new THREE.Vector3();

    for (let f = 0; f < faceCount; f++) {
        const base = f * 9;

        a.set(target[base + 0], target[base + 1], target[base + 2]);
        b.set(target[base + 3], target[base + 4], target[base + 5]);
        c.set(target[base + 6], target[base + 7], target[base + 8]);

        centroid.copy(a).add(b).add(c).multiplyScalar(1 / 3);

        // face basis on its own plane (LOCAL)
        u.copy(b).sub(a).normalize();
        ca.copy(c).sub(a);
        n.copy(b).sub(a).cross(ca).normalize();
        v.copy(n).cross(u).normalize();

        const sx = rng11(f * 5 + 0) * spread;
        const sy = rng11(f * 5 + 1) * spread;
        const dz = rng11(f * 5 + 2) * depthJitter;

        const faceOriginWorld = new THREE.Vector3()
            .copy(planeCenter)
            .addScaledVector(camRight, sx)
            .addScaledVector(camUp, sy)
            .addScaledVector(camDir, dz);

        const ang = rng11(f * 5 + 3) * roll;
        const cosA = Math.cos(ang);
        const sinA = Math.sin(ang);

        const verts = [a, b, c];

        for (let i = 0; i < 3; i++) {
            const pLocal = verts[i].clone().sub(centroid);

            // coords in (u,v) local
            const x = pLocal.dot(u);
            const y = pLocal.dot(v);

            // rotate in the camera plane
            const xr = x * cosA - y * sinA;
            const yr = x * sinA + y * cosA;

            const startWorld = new THREE.Vector3()
                .copy(faceOriginWorld)
                .addScaledVector(camRight, xr)
                .addScaledVector(camUp, yr);

            mesh.worldToLocal(startWorld);

            out[base + i * 3 + 0] = startWorld.x;
            out[base + i * 3 + 1] = startWorld.y;
            out[base + i * 3 + 2] = startWorld.z;
        }
    }

    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();
}

export default class World {
    constructor() {
        this.appInstance = Application.getInstance();
        this.animationTracker = AnimationTracker.getInstance();
        this.init();
    }

    async init() {
        this.createIntroGeometry();
        this.setupLights();
        await this.setAnimation();
    }

    setupLights() {
        this.appInstance.scene.add(new THREE.AmbientLight(0xffffff, 0.1));

        const dir = new THREE.DirectionalLight(0xffffff, 2.5);
        dir.position.set(10, 5, 5);
        dir.lookAt(this.customMesh.position)
        this.appInstance.scene.add(dir);
    }

    createIntroGeometry() {
        // --- geometry
        this.customGeometry = CreateCustomGeometry(1);

        this.customMaterial = new MeshStandardNodeMaterial();

        const baseColor = attribute("color", "vec3");
        const wobbleColor = sin(time.mul(0.8).add(baseColor.x.mul(10.0)).mul(0.15));
        const animatedColor = baseColor.add(vec3(wobbleColor));

        this.colorMix = uniform(float(0));
        const targetColor = vec3(0.0, 0.0, 0.0);

        this.customMaterial.colorNode = mix(baseColor, targetColor, this.colorMix);

        this.customMaterial.emissiveNode =
            attribute("color", "vec3").mul(0.05);
        this.customMaterial.roughness = 0.6;
        this.customMaterial.metalness = 0.0;

        this.customMaterial.polygonOffset = true;
        this.customMaterial.polygonOffsetFactor = 1;
        this.customMaterial.polygonOffsetUnits = 1;

        this.customMesh = new THREE.Mesh(this.customGeometry, this.customMaterial);

        this.setupMeshPlacement();

        this.appInstance.scene.add(this.customMesh);

        this.setupAssembleAnimation();
        this.appInstance.time.events.on("tick", () => this.onTick());
        this.appInstance.viewport.events.on("resize", () => this.onResize());
    }

    setupMeshPlacement() {
        const zPlane = 0;
        const { width } = this.visibleSizeAtZ(this.appInstance.camera, zPlane);
        this.customMesh.position.set(width / 4, 0, zPlane);
        this._zPlane = zPlane;
    }

    setupAssembleAnimation() {
        const geom = this.customGeometry;
        this.posAttr = geom.getAttribute("position");
        this.target = geom.userData.targetPositions;

        this.faceCount = this.posAttr.array.length / 9;

        this.assemble = { t: 0 };

        this.rebuildStartPose = () => {
            buildFacePlaneStartPositions(
                geom,
                this.customMesh,
                this.appInstance.camera,
                { planeOffset: 0.0, spread: 2.2, depthJitter: 0.35, roll: Math.PI * 0.65 }
            );

            // cache the freshly computed start pose
            this.start = this.posAttr.array.slice();

            // IMPORTANT: ensure we’re visually at t=0 pose right now
            this.assemble.t = 0;
        };

        // build it once initially
        this.rebuildStartPose();

        this.updatePositions = () => {
            const t = this.assemble.t;
            const pos = this.posAttr.array;
            const start = this.start;
            const target = this.target;

            for (let f = 0; f < this.faceCount; f++) {
                const base = f * 9;

                const delayFactor = 0.01;
                const delay = (f / this.faceCount) * delayFactor;
                let tf = (t - delay) / (1.0 - delayFactor);
                tf = Math.max(0, Math.min(1, tf));
                const tt = tf * tf * (3 - 2 * tf);

                for (let i = 0; i < 9; i++) {
                    const idx = base + i;
                    pos[idx] = start[idx] + (target[idx] - start[idx]) * tt;
                }
            }

            this.posAttr.needsUpdate = true;
            geom.computeVertexNormals();
        };
    }

    visibleSizeAtZ(camera, z = 0) {
        const distance = Math.abs(camera.position.z - z);
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const height = 2 * Math.tan(vFov / 2) * distance;
        const width = height * camera.aspect;
        return { width, height };
    }

    onTick() {
        const home = this.animationTracker.triggerSection.home;
        if (this.heroAnimation && home) {
            this.heroAnimation.progress(home.roundedProgress);
        }

        const journey = this.animationTracker.triggerSection.journey;
        if (this.journeyAnimation && journey) {
            this.journeyAnimation.progress(journey.roundedProgress)
        }

        if (home.roundedProgress !== 1) {
            this.customMesh.rotation.y += this.appInstance.time.delta / 10000;
            this.customMesh.rotation.z += this.appInstance.time.delta / 10000;
            this.customMesh.rotation.x += this.appInstance.time.delta / 10000;
        }
    }

    onResize() {
        const { width } = this.visibleSizeAtZ(this.appInstance.camera, this._zPlane);
        this.customMesh.position.set(width / 4, 0, this._zPlane);
    }

    async setAnimation() {
        const home = this.animationTracker._ensureSection("home");
        await home.ready;

        this.heroAnimation = gsap.timeline({ paused: true });
        // this.heroAnimation.to(this.customMesh.position, { x: 0, duration: 1, ease: 'power2.inOut'});
        // this.heroAnimation.to(this.customMesh.rotation, { duration: 1, y: 2, ease: "power2.inOut" }, "<");

        this.heroAnimation.set(this.assemble, { t: 0 })

        gsap.to(this.assemble, {
            t: 1,
            duration: 1.6,
            // ease: "power3.inOut",
            onUpdate: this.updatePositions,
        });

        const journey = this.animationTracker._ensureSection("journey");
        await journey.ready;

        this.journeyAnimation = gsap.timeline({ paused: true });
        // this.journeyAnimation.to(this.customMesh.rotation, { duration: 1, y: 4 })

        // this.journeyAnimation.to(this.customMesh.scale, {
        //     x: 0,
        //     y: 0,
        //     z: 0,
        //     duration: 1,
        //     ease: "power2.inOut"
        // }, "<");
    }

    destructor() { }
}
