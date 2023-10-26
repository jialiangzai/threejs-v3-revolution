// 目标：初始化 three.js 基础环境
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
export let scene, camera, renderer, controls, css3dRenderer;

// 初始化场景，摄像机，渲染器，，，
(function init () {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 0.1
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
})();

// 轨道控制器
(function controlscreate () {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.minPolarAngle = 0.25 * Math.PI
  controls.enableZoom = false
})();

// 坐标轴
(function createAxesHelper () {
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
});

// 场景适配
(function reseizeWin () {
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })
})();
// 创建CSS3DRenderer
(function create3dRenderer () {
  css3dRenderer = new CSS3DRenderer()
  css3dRenderer.setSize(window.innerWidth, window.innerHeight)
  css3dRenderer.domElement.style.position = 'fixed'
  css3dRenderer.domElement.style.left = '0'
  css3dRenderer.domElement.style.top = '0'
  css3dRenderer.domElement.style.pointerEvents = 'none'
  document.body.appendChild(css3dRenderer.domElement)
})();
// 渲染循环
(function rendloop () {
  renderer.render(scene, camera)
  controls.update()
  css3dRenderer.render(scene, camera)
  requestAnimationFrame(rendloop)
})();

