import * as dataGui from 'dat.gui'
let gui = new dataGui.GUI()
// 3d模型对象
export default function guiMove (obj) {
  const { position, rotation } = obj
  gui.add(obj.position, 'x', -1, 1, 0.01).name('位移 x')
  gui.add(obj.position, 'y', -1, 1, 0.01).name('位移 y')
  gui.add(obj.position, 'z', -1, 1, 0.01).name('位移 z')

  gui.add(obj.rotation, 'x', 0, 2 * Math.PI, 0.01).name('旋转 x')
  gui.add(obj.rotation, 'y', 0, 2 * Math.PI, 0.01).name('旋转 y')
  gui.add(obj.rotation, 'z', 0, 2 * Math.PI, 0.01).name('旋转 z')
}