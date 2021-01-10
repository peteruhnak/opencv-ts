import cv from '../../'

QUnit.module('OpenCV-TS', {
  before: cv.loadOpenCV
})

QUnit.test('it_works', (assert) => {
  const mat = new cv.Mat(10, 20, cv.CV_8UC3)
  console.log(mat.cols)
  mat.delete()
  assert.true(mat.isDeleted())
})