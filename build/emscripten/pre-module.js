const { webFrame } = require('electron')

webFrame.registerURLSchemeAsPrivileged('file')

function setupWASMModule() {
  return new Promise((resolve, reject) => {