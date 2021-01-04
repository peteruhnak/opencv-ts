# OpenCV-TS

Experimental WIP TypeScript typings and OpenCV.js/wasm loader.

Typings in this repository are generated by reusing/extending OpenCV python and embindgen generators.
This approach makes it easier to ensure the typings actually match the wasm, as well as being able to reuse documentation in C++ headers.

## Contents

Main opencv-ts contents:

* hand-written `lib/typings/core` for hand-written `core_bindings.cpp`
* generated `lib/typings/gen` from wasm build of opencv
* pretty-printed `opencv.js` (to avoid generating massive stacktraces in Node 14)
* generator invoker `ts_generator/typegen.py`
* `tests` are copied from `opencv` and converted to typescript mainly to test typings and find missing stuff
  * still wip; you can't actually run them (yet)

## Usage

1. Clone this repository https://github.com/peteruhnak/opencv-ts
2. `npm install /your/clone/dir/opencv-ts`

To use opencv in node, the library/wasm must be fully initialized, which may take a moment.
This library wraps emscripten's `onRuntimeInitialized` in a Promise-based loader `cv.loadOpenCV(): Promise<void>`.

* import the library as `import cv from 'opencv'`
* await promise `cv.loadOpenCV()` before doing anything
  * the loader does some derpy stuff to ensure `loadOpenCV` is reentrant, but loaded only once
* you must access cv objects and types through `cv`
  * e.g. `import { Mat } from 'opencv'` will not work


### Node Example

Uses `pngjs` to serialize image.

`cv-test.ts`:

```typescript
import cv from 'opencv'
import { PNG } from 'pngjs'
import fs from 'fs'

function matToDataUrl(mat: cv.Mat): string {
  const size = mat.size()
  const png = new PNG({ width: size.width, height: size.height })
  png.data.set(mat.data)
  const buffer = PNG.sync.write(png)
  return 'data:image/png;base64,' + buffer.toString('base64')
}

cv.loadOpenCV().then(() => {
  const baseMatSrc = new cv.Mat(2, 4, cv.CV_8UC3)
  baseMatSrc.data.set(new Uint8Array([
    255, 0, 0, 0, 255, 0, 0, 0,
    255, 255, 255, 255, 255, 0, 255, 0,
    255, 255, 255, 255, 0, 0, 0, 0
  ]))
  const baseMat = new cv.Mat()
  cv.cvtColor(baseMatSrc, baseMat, cv.COLOR_RGB2RGBA)
  const largerMat = new cv.Mat()
  cv.resize(baseMat, largerMat, { width: 20 * baseMat.cols, height: 20 * baseMat.rows }, 0, 0, cv.INTER_NEAREST)

  const contents = `
    <p>
    base:<br>
    <img src="${matToDataUrl(baseMat)}">
    <p>
    larger:<br>
    <img src="${matToDataUrl(largerMat)}">
    `
  fs.writeFileSync('out.html', contents)
  console.log('written to out.html')

  baseMatSrc.delete()
  baseMat.delete()
  largerMat.delete()
})
```

```
ts-node cv-test.ts
```

Open `out.html` in browser.


### Rebuilding Sources

* Clone this repository https://github.com/peteruhnak/opencv-ts
* Clone `master` branch of https://github.com/opencv/opencv
* Clone `ts-experimental` branch of https://github.com/peteruhnak/opencv

### OpenCV.js

Build (master) of `opencv/opencv` -- follow https://docs.opencv.org/master/d4/da1/tutorial_js_setup.html but use emsdk `1.39.0-upstream` (See also https://github.com/opencv/opencv/issues/19243 )

You can probably build from `ts-experimental` instead, but changes in `embindgen.py` may be unstable.

### Typings

Modify paths in `ts_generator/typegen.py`:

* `opencv_path = "D:/prog/opencv"` <- `ts-experimental` opencv clone
* `build_js_path = "D:/prog/github/build_js"` <- compiled opencv.js directory
* `ts_gen_path = "D:/prog/opencv-ts/lib/typings/gen"` <- where to generate typings (`lib/typings/gen` of this repository)

Run `python ts_generator/typegen.py`.

Note: you must use python 3.x for the typegen, because I am using python typings in some places (this will probably have to be changed later to support python 2).

### What Is Where

The actual generator in `ts-experimental` of peteruhnak/opencv consists of:

* `modules/js/generator/jsgen.py`
  * this is code extracted from `enbindgen.py` and modified so it can be actually imported from other modules
  * adds docstring from `hdr_parser.py` (c++ header parser) to FuncVariant & ClassInfo
  * this file is normally responsible for generating `bindings.cpp`
* `modules/js/generator/tsgen.py`
  * uses data constructed by `jsgen.py`/`JSWrapperGenerator` (Namespaces, ClassInfo, ...)
  * generates TypeScript files