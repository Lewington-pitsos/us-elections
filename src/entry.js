/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene and Camera. It also starts the render loop and 
 * handles window resizes.
 * 
 */

import { WebGLRenderer, PerspectiveCamera, Scene } from 'three';
import SeedScene from './objects/Scene.js';
import OrbitControls from 'three-orbitcontrols';

const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({antialias: true});
const seedScene = new SeedScene();
const controls = new OrbitControls(camera, renderer.domElement);

// scene
scene.add(seedScene);

// camera
camera.position.set(0,0,100);
controls.target.set(0, 0, 0);
controls.screenSpacePanning = true;
const angle = 1.6
controls.keyPanSpeed = 35;
controls.panSpeed = 5;
controls.minPolarAngle = angle;
controls.maxPolarAngle = angle; 

controls.minAzimuthAngle = -0.8;
controls.maxAzimuthAngle = 0.8;

controls.maxDistance = 250;
controls.minDistance = 20;
controls.update();

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor("#000000", 1);

// render loop
const onAnimationFrameHandler = (timeStamp) => {
  renderer.render(scene, camera);
  seedScene.update && seedScene.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => { 
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

// dom
document.body.style.margin = 0;
document.body.appendChild( renderer.domElement );
