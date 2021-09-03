// Imports
import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import * as dat from 'dat.gui';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

// Configuracion basica
let gui = undefined;
let size = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

// Paleta de colores
const palette = {
  bgColor: '#34495e', // CSS String
  color:0xffff00,
};

let plane = undefined;
let spotLight;

// Variables generales
let countCube = undefined;
let countSphere=undefined;
let countLightsAm=undefined;
let countLightsDir=undefined;
let countLightsPoint=undefined;
let countLightsSpot=undefined;
let GUIFolderCube = 1;
let GUIFolderSphere=1;
let GUIFolderLightsAm=1;
let GUIFolderLightsSpot=1;
let GUIFolderLightsDir=1;
let GUIFolderLightsPoint=1;
// Arreglos de objetos
const objectsCube = [];
const objectsSphere = [];
const objectsLightAm = [];
const objectsLightDir = [];
const objectsLightPoint = [];
const objectsLightSpot = [];

var params =
{
     switch: false
};
//ajuste de ventana
window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};
//resetea las variables
export function reset() {
  scene.children = [];
  renderer.setSize(0, 0, true);
  countCube = 0;
  GUIFolderCube = 1;
  GUIFolderSphere=1;
  GUIFolderLightsAm=1;
  GUIFolderLightsSpot=1;
  GUIFolderLightsDir=1;
  GUIFolderLightsPoint=1;
  params.switch=true;
}
//el main principal
export function main(optionSize) {
  reset();
  // Configuracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(palette.bgColor, 1);
  document.body.appendChild(renderer.domElement);
//llamado a las camaras 
  camera.position.z = 15;
  camera.position.y = 15;

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // Plano por defecto
  defaultPlane(optionSize);

  // GUI
  loadGUI();

  // Light
 //setupLights();

  // Render
  animate();
}

//Plano (suelo)
function defaultPlane(size) {
  const geometry = new THREE.PlaneGeometry(size, size, size, size);
  const material = new THREE.MeshBasicMaterial({
    color: palette.color,
    side: THREE.DoubleSide,
    wireframe: params.switch,
  });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  plane.receiveShadow = true;
  plane.rotation.x = Math.PI / 2;
}

//Menu de todas
function loadGUI() {
  cleanGUI();
  gui = new dat.GUI();
  gui.open();
  const folder1=gui.addFolder('plano');
  folder1.open();
  folder1.add(params, 'switch').name('wireframe');
  folder1.addColor(palette, 'color');
  folder1.addColor(palette, 'bgColor');
}

// Limpia el GUI
export function cleanGUI() {
  const dom = document.querySelector('.dg.main');
  if (dom) dom.remove();
}

//
function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 10, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  spotLight.castShadow = true;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
}
// Actualizar la escena en pantalla
function updateElements() {
  _updateCubes();
  _updateSpheres();
  _updateLightsSpot();
  _updateLightsAm();
  _updateLightsPoint() ;
  _updateLightsDir();
  plane.material.wireframe=params.switch;
  renderer.setClearColor(palette.bgColor, 1);
  plane.material.color=new THREE.Color(palette.color);

}
// crear cubo basico
export function createCubeGeneric() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: false,
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  objectsCube.push(cube);
  cube.position.y = 1;
  cube.castShadow = true;
  cube.receiveShadow = true;

  cube.GUIcube = _cubeObject();
  _createCubeGUI(cube.GUIcube);

  countCube = countCube + 1;
}
//crear esfera
export function createSphereGeneric() {
  const spheregeometry = new THREE.SphereGeometry();
  const  sphereMaterial = new THREE.MeshPhongMaterial( { color:0xff0000, transparent:true, opacity:1 } );
  const sphere = new THREE.Mesh(spheregeometry, sphereMaterial);

  scene.add(sphere);
  objectsSphere.push(sphere);
  sphere.position.y = 0.5;


  sphere.GUISphere = _SphereObject();
  _createSphereGUI(sphere.GUISphere);

  countSphere = countSphere + 1;
}
export function createLightAmGeneric() {

  const lights = new THREE.AmbientLight(0xff0000); 

  scene.add(lights);
  objectsLightAm.push(lights);

  lights.GUILightsAm = _lightsAmObject();
  _createLigthAmGUI(lights.GUILightsAm);

  countLightsAm = countLightsAm + 1;

}
export function createLightSpotGeneric() {

  const light = new THREE.SpotLight(0xff0000, 1);
  light.position.set(0, 10, 0);
  light.angle = Math.PI / 4;
  light.penumbra = 0.1;
  light.decay = 2;
  light.distance = 200;

  light.castShadow = true;
  scene.add(light);
  objectsLightSpot.push(light);
  light.GUILightsSpot = _lightsSpotObject();
  _createLigthsSpotGUI(light.GUILightsSpot);
  countLightsSpot = countLightsSpot + 1;

}
export function createLightPointGeneric() {

  const light = new THREE.PointLight(0xff0000, 1, 100 ); 
  light.position.set(0, 10, 0);


  scene.add(light);
  objectsLightPoint.push(light);
  light.GUILightsPoint = _lightsPointObject();
  _createLigthPointGUI(light.GUILightsPoint);
  countLightsPoint = countLightsPoint + 1;

}

export function createLightDirGeneric() {
var activar=true;
  const  light = new THREE.DirectionalLight(0xff0000);
  const helper = new THREE.DirectionalLightHelper(light,5);
  light.position.set(0, 1, 0);
  light.castShadow = true;

  scene.add(helper);
  scene.add(light);
  objectsLightDir.push(helper);
  light.GUILightsDir= _lightsDirObject();
  _createLigthDirGUI(light.GUILightsDir);
  countLightsDir= countLightsDir + 1;

}
function _cubeObject() {
  var GUIcube = {
    rx: 0, ry: 0, rz:0,
    material: 'Basic',
    materialColor: 0xffaec0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    x: 0,
    y: 0.5,
    z: 0,
  };
  return GUIcube;
}

  function _SphereObject() {
    var GUISphere = {
      color:0xff0000,
     rx: 0, ry: 0, rz:0,
      x: 0, y: 0.5, z: 0,
      shininess: 30,
      opacity: 1, 
      transparent: true,
      material: 'Phong',
      scaleX: 1,
      scaleY: 32,
      scaleZ: 32,
    };

  return GUISphere;
}
function _lightsAmObject() {
  var GUILightsAm = {
    color:0xFFFAF0,
    intensity:1,
  };
  

  return GUILightsAm;
}

function _lightsSpotObject() {
  var GUILightsSpot= {
    color: 0xFFFAF0,
    intensity: 1,
    castShadow: true,
    x: 0,
    y: 10,
    z: 0,
    angle: Math.PI / 4,
    penumbra: 0.1,
    decay: 2,
    distance: 200,
  };
  

  return GUILightsSpot;
}
function _lightsDirObject() {
  var GUILightsDir= {
    color: 0xFFFAF0,
    intensity: 1,
    castShadow: true,
    x: 0,
    y: 1,
    z: 0,
  };
  

  return GUILightsDir;
}

function _lightsPointObject() {
  var GUILightsPoint= {
    color: 0xFFFAF0,
 intensity: 1,
 x: 3,
 y: 3,
 z: 3,
 decay: 1,
 distance: 0,
  };
  

  return GUILightsPoint;
}


function _createCubeGUI(GUIcube) {
  const folder = gui.addFolder('Cube' + GUIFolderCube);
  // Material
  folder.addColor(GUIcube, 'materialColor');
  folder.add(GUIcube, 'material', ['Basic', 'Phong', 'Lambert']);

  // Escala
  
  folder.add(GUIcube, 'scaleX').min(1).max(32).step(1).listen();
  folder.add(GUIcube, 'scaleY').min(1).max(32).step(1).listen();
  folder.add(GUIcube, 'scaleZ').min(1).max(32).step(1).listen();

  // Posicion
  folder.add(GUIcube, 'x').min(0).max(20).step(1).listen();
  folder.add(GUIcube, 'y').min(0.5).max(20).step(1).listen();
  folder.add(GUIcube, 'z').min(0).max(20).step(1).listen();
  folder.add(GUIcube, 'rx', -6, Math.PI * 2);
  folder.add(GUIcube, 'ry', -6, Math.PI * 2);
  folder.add(GUIcube, 'rz', -6, Math.PI * 2);

  GUIFolderCube = GUIFolderCube + 1;
}
function _createSphereGUI(GUISphere) {
  const folder2 = gui.addFolder('Sphere ' + GUIFolderSphere);
  // Material
  folder2.addColor(GUISphere, 'color');
  folder2.add(GUISphere, 'transparent');

  folder2.add(GUISphere, 'shininess').min(0).max(80).step(1).listen();
  folder2.add(GUISphere, 'opacity').min(0).max(1).step(0.01).name('Opacity').listen();
  folder2.add(GUISphere, 'material', ['Basic', 'Phong', 'Lambert']);

  // Escala
  folder2.add(GUISphere, 'scaleX').min(1).max(20).step(1).listen();
  folder2.add(GUISphere, 'scaleY').min(1).max(32).step(1).listen();
  folder2.add(GUISphere, 'scaleZ').min(1).max(32).step(1).listen();
  // Posicion
  folder2.add(GUISphere, 'x').min(0).max(20).step(1).listen();
  folder2.add(GUISphere, 'y').min(0.5).max(20).step(1).listen();
  folder2.add(GUISphere, 'z').min(0).max(20).step(1).listen();
  folder2.add(GUISphere, 'rx', -6, Math.PI * 2);
  folder2.add(GUISphere, 'ry', -6, Math.PI * 2);
  folder2.add(GUISphere, 'rz', -6, Math.PI * 2);

 

  GUIFolderSphere = GUIFolderSphere + 1;
}
function _createLigthAmGUI(GUILightsAm) {
  const folder3 = gui.addFolder('ligths' + GUIFolderLightsAm);
  // Material
  folder3.addColor(GUILightsAm, 'color');
  folder3.add(GUILightsAm, 'intensity').min(0).max(1).step(0.01).name('Intencity').listen();
  // Escala

  // Posicion
 
  GUIFolderLightsAm= GUIFolderLightsAm + 1;
}

function _createLigthsSpotGUI(GUILightsSpot) {
  const folder5 = gui.addFolder('LightSpot' + GUIFolderLightsSpot);
  // Material
  folder5.addColor(GUILightsSpot, 'color');
  folder5.add(GUILightsSpot, 'intensity').min(0).max(1).step(0.01).name('Intencity').listen();
  folder5.add(GUILightsSpot, 'penumbra').min(0).max(1).step(0.01).name('Penumbra').listen();
  folder5.add(GUILightsSpot, 'decay').min(0).max(2).step(0.01).name('Decay').listen();
  // Escala
  folder5.add(GUILightsSpot, 'x', -6, Math.PI * 2);
  folder5.add(GUILightsSpot, 'y', 0, Math.PI * 2);
  folder5.add(GUILightsSpot, 'z', -6, Math.PI * 2);
  folder5.add(GUILightsSpot, 'angle', Math.PI / 4, Math.PI / 2);
  folder5.add(GUILightsSpot, 'distance').min(0).max(50).step(1).listen();
  // Posicion


  GUIFolderLightsSpot= GUIFolderLightsSpot + 1;
}
function _createLigthDirGUI(GUILightsDir) {
  const folder6 = gui.addFolder('ligths3' + GUIFolderLightsDir);
  // Material
  folder6.addColor(GUILightsDir, 'color');
  folder6.add(GUILightsDir, 'intensity').min(0).max(1).step(0.01).name('Intencity').listen();
  // Escala
  folder6.add(GUILightsDir, 'x', -6, Math.PI * 2);
  folder6.add(GUILightsDir, 'y', 0, Math.PI * 2);
  folder6.add(GUILightsDir, 'z', -6, Math.PI * 2);
  // Posicion


  GUIFolderLightsDir= GUIFolderLightsDir+ 1;
}
function _createLigthPointGUI(GUILightsPoint) {
  const folder7 = gui.addFolder('ligths4' + GUIFolderLightsPoint);
  // Material
  folder7.addColor(GUILightsPoint, 'color');
  folder7.add(GUILightsPoint, 'intensity').min(0).max(1).step(0.01).name('Intencity').listen();
  // Escala
  folder7.add(GUILightsPoint, 'x', -6, Math.PI * 2);
  folder7.add(GUILightsPoint, 'y', 0, Math.PI * 2);
  folder7.add(GUILightsPoint, 'z', -6, Math.PI * 2);
  folder7.add(GUILightsPoint, 'decay').min(0).max(2).step(0.01).name('Intencity').listen();
  // Posicion
  folder7.add(GUILightsPoint, 'distance').min(0).max(50).step(1).listen();

  GUIFolderLightsPoint= GUIFolderLightsPoint+ 1;
}


function _updateCubes() {
  Object.keys(objectsCube).forEach((i) => {
    const cubeSelected = objectsCube[i];
    //Material cubo
    cubeSelected.GUIcube.material == 'Basic'
      ? (cubeSelected.material = new THREE.MeshBasicMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : cubeSelected.GUIcube.material == 'Lambert'
      ? (cubeSelected.material = new THREE.MeshLambertMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : (cubeSelected.material = new THREE.MeshPhongMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }));

    //Escalar cubo
    cubeSelected.geometry = new THREE.BoxGeometry(
    
      cubeSelected.GUIcube.scaleX,
      cubeSelected.GUIcube.scaleY,
      cubeSelected.GUIcube.scaleZ,

    );

    //Posición
    cubeSelected.position.x = cubeSelected.GUIcube.x;
    cubeSelected.position.y = cubeSelected.GUIcube.y;
    cubeSelected.position.z = cubeSelected.GUIcube.z;
    cubeSelected.rotation.x=cubeSelected.GUIcube.rx;
    cubeSelected.rotation.y=cubeSelected.GUIcube.ry;
    cubeSelected.rotation.z=cubeSelected.GUIcube.rz;
  });
}
 function _updateSpheres(){
Object.keys(objectsSphere).forEach((i)=>{
  const sphereSelected = objectsSphere[i];
  sphereSelected.GUISphere.material == 'Basic'
      ? (sphereSelected.material = new THREE.MeshBasicMaterial({
        color: sphereSelected.GUISphere.color,transparent: sphereSelected.GUISphere.transparent,
          opacity: sphereSelected.GUISphere.opacity,
        }))
      : sphereSelected.GUISphere.material == 'Lambert'
      ? (sphereSelected.material = new THREE.MeshLambertMaterial({
          color: sphereSelected.GUISphere.color,transparent: sphereSelected.GUISphere.transparent,
          opacity: sphereSelected.GUISphere.opacity,
        }))
      : (sphereSelected.material = new THREE.MeshPhongMaterial({
        color: sphereSelected.GUISphere.color,transparent: sphereSelected.GUISphere.transparent,
        opacity: sphereSelected.GUISphere.opacity,
    
        }));
        
        sphereSelected.position.x = sphereSelected.GUISphere.x;
        sphereSelected.position.y = sphereSelected.GUISphere.y;
        sphereSelected.position.z = sphereSelected.GUISphere.z;
        sphereSelected.rotation.x=sphereSelected.GUISphere.rx;
        sphereSelected.rotation.y=sphereSelected.GUISphere.ry;
        sphereSelected.rotation.z=sphereSelected.GUISphere.rz;
       

        sphereSelected.geometry =  new THREE.SphereGeometry(
          sphereSelected.GUISphere.scaleX,
          sphereSelected.GUISphere.scaleY,
          sphereSelected.GUISphere.scaleZ,
        );
   

});
 }


 function _updateLightsSpot()    {
  Object.keys(objectsLightSpot).forEach((i) => {
   const LightSpotSelected = objectsLightSpot[i];
  
   LightSpotSelected.color.setHex(LightSpotSelected.GUILightsSpot.color);
   LightSpotSelected.intensity = LightSpotSelected.GUILightsSpot.intensity;
   LightSpotSelected.position.x = LightSpotSelected.GUILightsSpot.x;
   LightSpotSelected.position.y = LightSpotSelected.GUILightsSpot.y;
   LightSpotSelected.position.z = LightSpotSelected.GUILightsSpot.z;
   LightSpotSelected.decay = LightSpotSelected.GUILightsSpot.decay;
   LightSpotSelected.distance = LightSpotSelected.GUILightsSpot.distance;
   
  });
  }
  function _updateLightsAm()    {
    Object.keys(objectsLightAm).forEach((i) => {
     const LightSpotSelected = objectsLightAm[i];
    
     LightSpotSelected.color.setHex(LightSpotSelected.GUILightsAm.color);
     LightSpotSelected.intensity = LightSpotSelected.GUILightsAm.intensity;
     
    });
    }
    function _updateLightsPoint()    {
      Object.keys(objectsLightPoint).forEach((i) => {
        const LighPointSelected = objectsLightPoint[i];
       
        LighPointSelected.color.setHex(LighPointSelected.GUILightsPoint.color);
        LighPointSelected.intensity = LighPointSelected.GUILightsPoint.intensity;
        LighPointSelected.position.x =LighPointSelected.GUILightsPoint.x;
        LighPointSelected.position.y = LighPointSelected.GUILightsPoint.y;
        LighPointSelected.position.z = LighPointSelected.GUILightsPoint.z;
        LighPointSelected.decay = LighPointSelected.GUILightsPoint.decay;
        LighPointSelected.distance = LighPointSelected.GUILightsPoint.distance;
      });
      }
      function _updateLightsDir()    {
        Object.keys(objectsLightDir).forEach((i) => {
          const LightDirSelected = objectsLightDir[i];
          
          LightDirSelected.light.color.setHex(LightDirSelected.light.GUILightsDir.color);
          LightDirSelected.light.intensity = LightDirSelected.light.GUILightsDir.intensity;
          LightDirSelected.light.position.x =LightDirSelected.light.GUILightsDir.x;
          LightDirSelected.light.position.y = LightDirSelected.light.GUILightsDir.y;
          LightDirSelected.light.position.z = LightDirSelected.light.GUILightsDir.z;
          LightDirSelected.helper = new THREE.DirectionalLightHelper(LightDirSelected.light, 5 );

        });
        }