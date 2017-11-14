import helloWorldModuleLoad from './hello-world'

// const HelloWorldModule = helloWorldModule()
helloWorldModuleLoad.then((helloModule) => {
  console.log('module loaded')
  console.log(helloModule.ccall(
    'addNumbers',
    'number',
    ['number', 'number'],
    [1, 2],
  ))
})
