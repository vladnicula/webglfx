import NoiseLoader from './noise'

NoiseLoader.then((noiseModule) => {
  console.log(noiseModule.ccall(
    'perlin2d',
    'number',
    ['number', 'number', 'number', 'number'],
    [2, 2, 30, 3],
  ))
})
