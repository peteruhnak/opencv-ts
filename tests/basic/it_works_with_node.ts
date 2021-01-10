import cv from '../../'

function loadOpenCv(): Promise<void> {
  return cv.loadOpenCV()
}

loadOpenCv().then(() => {
  const mat = new cv.Mat(10, 20, cv.CV_8UC3)
  console.log(mat.cols)
  mat.delete()
})