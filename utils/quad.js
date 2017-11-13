import Modal from './model'

export const createQuadMesh = (renderer) => {
  const aVert = [
    -0.5, 0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0,
  ]

  const aUV = [0, 0, 0, 1, 1, 1, 1, 0]

  const aIndex = [0, 1, 2, /**/ 2, 3, 0]

  const mesh = renderer.createMeshVAO('Quad', aIndex, aVert, null, aUV)

  mesh.noCulling = true
  mesh.doBlending = true
  return mesh
}

export const createQuadModel = renderer => new Modal(createQuadMesh(renderer))

export default null
