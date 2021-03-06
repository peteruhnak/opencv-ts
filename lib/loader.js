/** @type {Promise<void>|undefined} */
let loadPendingPromise = undefined

/**
 * 2=not loaded, 1=loading, 0=loaded
 *  @type {0|1|2}
 */
let status = 2

const moduleExports = {}

function createLoadPromise() {
  return new Promise(resolve => {
    let moduleContents
    global.Module = {
      onRuntimeInitialized: () => {
        Object.assign(moduleExports, moduleContents)
        status = 0
        resolve()
      }
    }
    moduleContents = require('./_opencv.js')
  })
}

async function loadOpenCV() {
  if (status == 0) {
    return
  } else if (status == 1) {
    await loadPendingPromise()
    return
  } else if (status == 2) {
    loadPendingPromise = createLoadPromise()
    status = 1
    return loadPendingPromise
  } else {
    throw new Error(`Unexpected load status >${status}<`)
  }
}

moduleExports['loadOpenCV'] = loadOpenCV

module.exports = moduleExports