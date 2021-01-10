// This file is part of OpenCV project.
// It is subject to the license terms in the LICENSE file found in the top-level directory
// of this distribution and at http://opencv.org/license.html.

import cv from '../../'

function generateTestFrame(width?: number, height?: number) {
  const w = width || 200
  const h = height || 200
  const img = new cv.Mat(h, w, cv.CV_8UC1, new cv.Scalar(0, 0, 0, 0))
  const s = new cv.Scalar(255, 255, 255, 255)
  const s128 = new cv.Scalar(128, 128, 128, 128)
  const rect = new cv.Rect(w / 4, h / 4, w / 2, h / 2)
  img.roi(rect).setTo(s)
  img.roi(new cv.Rect(w / 2 - w / 8, h / 2 - h / 8, w / 4, h / 4)).setTo(s128)
  cv.rectangle(img, new cv.Point(w / 8, h / 8), new cv.Point(w - w / 8, h - h / 8), s, 5)
  cv.rectangle(img, new cv.Point(w / 5, h / 5), new cv.Point(w - w / 5, h - h / 5), s128, 3)
  cv.line(img, new cv.Point(-w, 0), new cv.Point(w / 2, h / 2), s128, 5)
  cv.line(img, new cv.Point(2 * w, 0), new cv.Point(w / 2, h / 2), s, 5)
  return img
}

QUnit.module('Features2D', {
  before: cv.loadOpenCV
})

QUnit.test('Detectors', function (assert) {
  const image = generateTestFrame()

  const kp = new cv.KeyPointVector()

  const orb = new cv.ORB()
  orb.detect(image, kp)
  assert.strictEqual(kp.size(), 67, 'ORB')

  const mser = new cv.MSER()
  mser.detect(image, kp)
  assert.strictEqual(kp.size(), 7, 'MSER')

  const brisk = new cv.BRISK()
  brisk.detect(image, kp)
  assert.strictEqual(kp.size(), 191, 'BRISK')

  const ffd = new cv.FastFeatureDetector()
  ffd.detect(image, kp)
  assert.strictEqual(kp.size(), 12, 'FastFeatureDetector')

  const afd = new cv.AgastFeatureDetector()
  afd.detect(image, kp)
  assert.strictEqual(kp.size(), 67, 'AgastFeatureDetector')

  const gftt = new cv.GFTTDetector()
  gftt.detect(image, kp)
  assert.strictEqual(kp.size(), 168, 'GFTTDetector')

  const kaze = new cv.KAZE()
  kaze.detect(image, kp)
  assert.strictEqual(kp.size(), 159, 'KAZE')

  const akaze = new cv.AKAZE()
  akaze.detect(image, kp)
  assert.strictEqual(kp.size(), 53, 'AKAZE')
})

QUnit.test('BFMatcher', function (assert) {
  // Generate key points.
  const image = generateTestFrame()

  const kp = new cv.KeyPointVector()
  const descriptors = new cv.Mat()
  const orb = new cv.ORB()
  orb.detectAndCompute(image, new cv.Mat(), kp, descriptors)

  assert.strictEqual(kp.size(), 67)

  // Run a matcher.
  const dm = new cv.DMatchVector()
  const matcher = new cv.BFMatcher()
  matcher.match(descriptors, descriptors, dm)

  assert.strictEqual(dm.size(), 67)
})

QUnit.test('Drawing', function (assert) {
  // Generate key points.
  const image = generateTestFrame()

  const kp = new cv.KeyPointVector()
  const descriptors = new cv.Mat()
  const orb = new cv.ORB()
  orb.detectAndCompute(image, new cv.Mat(), kp, descriptors)
  assert.strictEqual(kp.size(), 67)

  const dst = new cv.Mat()
  cv.drawKeypoints(image, kp, dst)
  assert.strictEqual(dst.rows, image.rows)
  assert.strictEqual(dst.cols, image.cols)

  // Run a matcher.
  const dm = new cv.DMatchVector()
  const matcher = new cv.BFMatcher()
  matcher.match(descriptors, descriptors, dm)
  assert.strictEqual(dm.size(), 67)

  cv.drawMatches(image, kp, image, kp, dm, dst)
  assert.strictEqual(dst.rows, image.rows)
  assert.strictEqual(dst.cols, 2 * image.cols)

  const dmv = new cv.DMatchVectorVector()
  matcher.knnMatch(descriptors, descriptors, dmv, 2)
  assert.strictEqual(dm.size(), 67)
  cv.drawMatchesKnn(image, kp, image, kp, dmv, dst)
  assert.strictEqual(dst.rows, image.rows)
  assert.strictEqual(dst.cols, 2 * image.cols)
})
