import Modal from './model'

export const createMultiQuadMesh = (renderer, count) => {
  console.log('createMultiQuadMesh')
  const geometryUV = [0, 0, 0, 1, 1, 1, 1, 0]

  const aIndex = []
  const aVert = []
  const aUV = []

  for (let i = 0; i < count; i += 1) {
    const size = 0.2 + (0.8 * Math.random())
    const half = size * 0.5
    const angle = Math.PI * 2 * Math.random()
    const dx = half * Math.cos(angle)
    const dy = half * Math.sin(angle)
    const x = -2.5 + (Math.random() * 5)
    const y = -2.5 + (Math.random() * 5)
    const z = 2.5 - (Math.random() * 5)

    const p = i * 4

    // debugger // eslint-disable-line no-debugger

    aVert.push(x - dx, y + half, z - dy)
    aVert.push(x - dx, y - half, z - dy)
    aVert.push(x + dx, y - half, z + dy)
    aVert.push(x + dx, y + half, z + dy)

    aUV.push(geometryUV)
    aIndex.push(p, p + 1, p + 2, p + 2, p + 3, p)
  }


  const mesh = renderer.createMeshVAO('MultiQuad', aIndex, aVert, null, aUV)

  mesh.noCulling = true
  mesh.doBlending = true
  return mesh
}

export const createMultiQuadModel = (renderer, count) =>
  new Modal(createMultiQuadMesh(renderer, count))

export default null
