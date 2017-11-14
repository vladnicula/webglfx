import path from 'path'
import fs from 'fs'

const loadWasmRaw = (locaiton, importObject) => new Promise((resolve, reject) => {
  fs.readFile(locaiton, (err, data) => {
    if (err) {
      return reject(err)
    }
    return resolve(WebAssembly.instantiate(data, importObject))
  })
})

loadWasmRaw(path.resolve(__dirname, './binary/add.wasm'), {}).then((wasmModule) => {
  console.log(wasmModule.instance.exports.add(1, 2))
})


loadWasmRaw(path.resolve(__dirname, './binary/more.wasm'), {}).then((wasmModule) => {
  console.log(wasmModule.instance.exports.makeArray(5, 10))
})
