// https://github.com/echamudi/opencv-wasm/blob/master/utils/seperateBinaryFile.js

import fs from 'fs'
import path from 'path'

const openCvJs = fs.readFileSync(path.join(__dirname, 'opencv.js'), 'utf-8')

// Generate OpenCV.wasm
const matchResult = openCvJs.match(/var wasmBinaryFile = "(.*?)";/gs)

if (matchResult == null) {
  throw new Error('WASM Base64 is not found')
}

const wasmBase64 = matchResult[0]
  .replace('var wasmBinaryFile = "data:application/octet-stream;base64,', '')
  .replace('=";', '')

fs.writeFileSync(path.join(__dirname, 'bin/opencv.wasm'), wasmBase64, { encoding: 'base64' })
console.log('Generated OpenCV.wasm')

// Update opencv.js
const openCvJsNew = openCvJs.replace(/var wasmBinaryFile = "(.*?)";/, 'var wasmBinaryFile="./opencv.wasm";')
fs.writeFileSync(path.join(__dirname, 'bin/opencv.js'), openCvJsNew, { encoding: 'utf8' })
console.log('Updated opencv.js')