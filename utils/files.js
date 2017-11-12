import fs from 'fs'

export const readFile = (...args) => new Promise((resolve, reject) => {
  fs.readFile(...args, (err, data) => {
    if (err) {
      return reject(err)
    }
    return resolve(data)
  })
})

export const writeFile = (...args) => new Promise((resolve, reject) => {
  fs.writeFile(...args, (err, data) => {
    if (err) {
      return reject(err)
    }
    return resolve(data)
  })
})

export default null
