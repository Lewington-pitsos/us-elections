/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene and Camera. It also starts the render loop and 
 * handles window resizes.
 * 
 */

import { WebGLRenderer, PerspectiveCamera, Scene, MOUSE, Vector2, Raycaster } from 'three';
import SeedScene from './objects/Scene.js';
import OrbitControls from 'three-orbitcontrols';
import { Election } from './objects/Election/Election.js';
import { BoxGeometry } from 'three';

const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({antialias: true});
const seedScene = new SeedScene();
const controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons.LEFT = MOUSE.PAN;
controls.mouseButtons.MIDDLE = MOUSE.ZOOM;
controls.mouseButtons.RIGHT = MOUSE.ROTATE;

// scene
scene.add(seedScene);

// camera
camera.position.set(0,0,150);
controls.target.set(0, 0, 0);
controls.screenSpacePanning = true;
controls.keys = {}
controls.zoomSpeed = 1.8
const angle = 1.6
controls.panSpeed = 4;
controls.minPolarAngle = angle;
controls.maxPolarAngle = angle; 
controls.enableDamping = false;

controls.minAzimuthAngle = -0.8;
controls.maxAzimuthAngle = 0.8;

controls.maxDistance = 250;
controls.minDistance = 20;

controls.update();

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor("#000000", 1);


var pointer = new Vector2();
var raycaster = new Raycaster();


function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  hoverState();
  unHighlight();
}


let highlighted = [];
let keep = []
let selected = []

function onClick() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  for (let index = 0; index < intersects.length; index++) {
    const element = intersects[index];
    if (element.object.parent instanceof Election && element.object.geometry instanceof BoxGeometry) {
      const selectedSeat = element.object.parent.seat;
      if (!selected.includes(selectedSeat)) {
        selected.push(selectedSeat);
      } else {
        selected = selected.filter(e => e !== selectedSeat);
      }
    }
  }
}

function hoverState() {
  raycaster.setFromCamera(pointer, camera);
  keep = []
  const intersects = raycaster.intersectObjects(scene.children);
  for (let index = 0; index < intersects.length; index++) {
    const element = intersects[index];
    if (element.object.parent instanceof Election && element.object.geometry instanceof BoxGeometry) {
      const selectedSeat = element.object.parent.seat;
      if (!keep.includes(selectedSeat)) {
        keep.push(selectedSeat);
        if (!highlighted.includes(selectedSeat)) {
          selectedSeat.highlightAll();
        }
      }
    }
  }
}

function unHighlight() {
  for (let index = 0; index < highlighted.length; index++) {
    const seat = highlighted[index];
    if (!keep.includes(seat) && !selected.includes(seat)) {
      seat.unfocusAll()
    }
  }
  highlighted = keep; 
}

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
window.addEventListener('click', onClick);
window.addEventListener( 'pointermove', onPointerMove );

// dom
document.body.style.margin = 0;
document.body.appendChild( renderer.domElement );
