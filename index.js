// main electorn

const bip = async () => {
  await new Promise(resolve => setTimeout(() => {
    resolve()
  }, 100))
  console.log('bip')
}

bip().then(() => (console.log('boop')))
