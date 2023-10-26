import { camera, scene } from './utils/init'
import * as THREE from 'three'
import gui from './utils/gui.js'
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'
import './style.css'
const group = new THREE.Group() // 当前空间中所有标记

/**'
 * 定义场景对象
 * 准备贴图函数
 * 准备地上标记点
 * 准备工具dat.gui调整位置和场景
 */
const senceObj = {
  one: {
    publicPath: 'technology/1/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [ // 当前空间中所有标记信息对象
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [-0.46, -0.11, -0.11],
        rotation: [1.42, 0.68, 1.63],
        // 下一个场景属性的名称
        targetAttr: 'two'
      }
    ]
  },
  two: {
    publicPath: 'technology/2/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [0.47, -0.2, 0],
        rotation: [1.48, 0.26, -1.78],
        targetAttr: 'one' // 目标场景信息对象属性
      }, {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [-0.46, -0.16, -0.3],
        rotation: [1.21, 0.78, 0],
        targetAttr: 'three' // 目标场景信息对象属性
      }
    ]
  },
  three: {
    publicPath: 'technology/3/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [0.4, -0.18, 0.32],
        rotation: [-1.53, -0.04, -1.26],
        targetAttr: 'two' // 目标场景信息对象属性
      }, {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [0.32, -0.16, -0.33],
        rotation: [1.46, 0.1, -0.17],
        targetAttr: 'four' // 目标场景信息对象属性
      }
    ]
  },
  four: {
    publicPath: 'technology/4/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [-0.35, -0.22, 0.4],
        rotation: [-0.85, -0.45, -1.8],
        targetAttr: 'three' // 目标场景信息对象属性
      },
      {
        name: 'dom',
        position: [0.49, 0, 0],
        rotation: [0, -0.5 * Math.PI, 0],
        targetAttr: 'five', // 目标场景信息对象属性
        active (e) {
          setMaterialCube(senceObj.five)
        }
      }
    ]
  },
  five: {
    publicPath: 'technology/5/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.03, 0.03],
        position: [-0.05, -0.05, 0.4],
        rotation: [1.21, -0.15, -0.69],
        targetAttr: 'four' // 目标场景信息对象属性
      },
      {
        name: 'video',
        imgUrl: 'video/movie.mp4',
        wh: [0.2, 0.1],
        position: [0.49, 0.04, 0.045],
        rotation: [0, -0.5 * Math.PI, 0]
      }
    ]
  }
}
function createCube () {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
  const cube = new THREE.Mesh(geometry, material)
  cube.scale.set(1, 1, -1)
  scene.add(cube)
  return cube
}
function setMaterialCube (infoObj) {
  clear()
  const { publicPath, imgUrlArr, markList } = infoObj
  const texture = new THREE.TextureLoader()
  texture.setPath(publicPath)
  let materArr = imgUrlArr.map(m => {
    let textureItm = texture.load(m)
    textureItm.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshBasicMaterial({
      map: textureItm,
      side: THREE.DoubleSide
    })
  })
  // scene.add(group)
  cubeObj.material = materArr
  markList.forEach(item => {
    if (item.name === 'landMark') {
      // 地板标记
      createLandMark(item)
    } else if (item.name === 'dom') {
      createDomMark(item)
    } else if (item.name === 'video') {
      createVideoMark(item)
    }
  })
  scene.add(group)
}
function bindClick () {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  window.addEventListener('click', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(pointer, camera)

    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(scene.children)
    let itemMark = intersects.find(mm => mm.object.name === 'mark')
    if (itemMark) {
      const infoObj = senceObj[itemMark.object.userData.targetAttr]
      setMaterialCube(infoObj)
    }
  })
}
function clear () {
  let list = [...group.children]
  list.forEach((itemc => {
    // 判断一下非css3d对象
    if (!itemc.isCSS3DObject) {
      itemc.geometry.dispose()
      itemc.material.dispose()
    }
    group.remove(itemc)
  }))
}
function createLandMark (params) {
  const { imgUrl, wh, position, rotation, targetAttr } = params
  const geometry = new THREE.PlaneGeometry(...wh)
  const texture = new THREE.TextureLoader().load(imgUrl)

  // 立即使用纹理进行材质创建
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(...position)
  plane.rotation.set(...rotation)
  plane.name = 'mark'
  plane.userData.targetAttr = targetAttr
  // gui(plane)
  group.add(plane)
}
function createDomMark (infoObj) {
  const { position, rotation, active } = infoObj

  let span = document.createElement('span')
  span.innerHTML = '前进'
  span.className = 'mark-style'
  span.style.pointerEvents = 'all'
  span.addEventListener('click', e => {
    // 为了保证这个函数通用，回调数据对象中的函数代码
    active()
  })
  const tag3d = new CSS3DObject(span)
  tag3d.scale.set(1 / 800, 1 / 800, 1 / 800)
  tag3d.position.set(...position)
  tag3d.rotation.set(...rotation)
  group.add(tag3d)
}
function createVideoMark (params) {
  const { imgUrl, wh, position, rotation, targetAttr } = params
  let video = document.createElement('video')
  video.src = imgUrl
  video.muted = true
  video.addEventListener('loadedmetadata', (e) => {
    video.play()
    video.muted = false
  })
  const geometry = new THREE.PlaneGeometry(...wh)
  const texture = new THREE.VideoTexture(video)
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(...position)
  plane.rotation.set(...rotation)
  plane.name = 'video'
  group.add(plane)
}
let cubeObj = createCube()
setMaterialCube(senceObj.one)
bindClick()