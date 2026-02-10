import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';


import Time from './utils/Time';
import Viewport from './utils/Viewport';
import World from './world';

export default class Application {
    static getInstance()
    {
        if (!Application.instance)
        {
            console.warn("Callback Error: Instance doesn't Exist");
            return;
        }

        return Application.instance;
    }

    constructor(_options) {
        Application.instance = this;

        this.$canvas = _options.$canvas;
    
        this.init()
    }

    async init() {
        this.scene = new THREE.Scene();

        this.time = new Time();
        this.viewport = new Viewport();
        this.renderer = new WebGPURenderer({
            canvas: this.$canvas,
            alpha: true,
            antialias: true,
        })

        await this.renderer.init()

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(2);
        this.renderer.setClearColor(0x000000, 0);

        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 4;

        this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 80);
        // this.camera = new THREE.OrthographicCamera(
        //     (frustumSize * aspect) / -2,
        //     (frustumSize * aspect) / 2,
        //     frustumSize / 2,
        //     frustumSize / -2,
        //     0.1,
        //     100
        // );

        // this.scene.add(new THREE.Mesh(
        //     new THREE.BoxGeometry(1,1,1),
        //     new THREE.MeshNormalMaterial()
        // ))

        this.camera.position.set(0, 0, 12);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = true;
        this.world = new World();

        // this.axesHelper = new THREE.AxesHelper(20);
        // this.scene.add(this.axesHelper)


        this.time.events.on('tick', ()=>{
            // console.log('tick')
            this.renderer.render(this.scene, this.camera);
        })

        this.viewport.events.on('resize', ()=>{
            this.camera.aspect = this.viewport.width / this.viewport.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.viewport.width, this.viewport.height);
        })
    }

    destroy()
    {
        this.time.off('tick');
    }
}