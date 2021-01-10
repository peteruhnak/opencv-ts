// //////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                           License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
// Third party copyrights are property of their respective owners.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
//   * Redistribution's of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//   * Redistribution's in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * The name of the copyright holders may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// This software is provided by the copyright holders and contributors "as is" and
// any express or implied warranties, including, but not limited to, the implied
// warranties of merchantability and fitness for a particular purpose are disclaimed.
// In no event shall the Intel Corporation or contributors be liable for any direct,
// indirect, incidental, special, exemplary, or consequential damages
// (including, but not limited to, procurement of substitute goods or services;
// loss of use, data, or profits; or business interruption) however caused
// and on any theory of liability, whether in contract, strict liability,
// or tort (including negligence or otherwise) arising in any way out of
// the use of this software, even if advised of the possibility of such damage.
//

// Author : Rijubrata Bhaumik, Intel Corporation. rijubrata.bhaumik[at]intel[dot]com

import cv from '../..'

declare global {
  interface Assert {
    epsilonEqual(actual: number, expected: number, epsilon: number): void
  }
}


Object.assign(QUnit.assert, {
  epsilonEqual: (actual: number, expected: number, epsilon: number): void => {
    const diff = Math.abs(actual - expected)
    QUnit.assert.pushResult({
      result: diff < epsilon,
      actual: actual,
      expected: expected,
      message: `Numbers expected to differ by less than ${epsilon}, was ${diff}`
    })
  }
})

QUnit.module('Photo', {
  before: cv.loadOpenCV
})

QUnit.test('test_photo', function (assert) {
  // CalibrateDebevec
  {
    const calibration = new cv.CalibrateDebevec(1, 2.2, true)
    assert.strictEqual(calibration.getSamples(), 1)
    assert.epsilonEqual(calibration.getLambda(), 2.2, 1e-5)
    assert.strictEqual(calibration.getRandom(), true)
    //let response = calibration.process(images, exposures);
    calibration.delete()
  }
  // CalibrateRobertson
  {
    const calibration = new cv.CalibrateRobertson(1, 2.2)
    assert.strictEqual(calibration.getMaxIter(), 1)
    assert.epsilonEqual(calibration.getThreshold(), 2.2, 1e-5)
    //let response = calibration.process(images, exposures);
    calibration.delete()
  }

  // MergeDebevec
  {
    const merge = new cv.MergeDebevec()
    assert.true(merge instanceof cv.MergeDebevec)
    //let hdr = merge.process(images, exposures, response);
    merge.delete()
  }
  // MergeMertens
  {
    const merge = new cv.MergeMertens(2.2, 3.3, 4.4)
    assert.epsilonEqual(merge.getContrastWeight(), 2.2, 1e-5)
    assert.epsilonEqual(merge.getSaturationWeight(), 3.3, 1e-5)
    assert.epsilonEqual(merge.getExposureWeight(), 4.4, 1e-5)
    //let hdr = merge.process(images, exposures, response);
  }
  // MergeRobertson
  {
    const merge = new cv.MergeRobertson()
    assert.true(merge instanceof cv.MergeRobertson)
    //let hdr = merge.process(images, exposures, response);
  }

  // TonemapDrago
  {
    const tonemap = new cv.TonemapDrago(2.2, 3.3, 4.4)
    assert.epsilonEqual(tonemap.getSaturation(), 3.3, 1e-5)
    assert.epsilonEqual(tonemap.getBias(), 4.4, 1e-5)
    // let ldr = new cv.Mat();
    // let retval = tonemap.process(hdr, ldr);
  }
  // TonemapMantiuk
  {
    const tonemap = new cv.TonemapMantiuk(2.2, 3.3, 4.4)
    assert.epsilonEqual(tonemap.getScale(), 3.3, 1e-5)
    assert.epsilonEqual(tonemap.getSaturation(), 4.4, 1e-5)
    // let ldr = new cv.Mat();
    // let retval = tonemap.process(hdr, ldr);
  }
  // TonemapReinhard
  {
    const tonemap = new cv.TonemapReinhard(2.2, 3.3, 4.4, 5.5)
    assert.epsilonEqual(tonemap.getIntensity(), 3.3, 1e-5)
    assert.epsilonEqual(tonemap.getLightAdaptation(), 4.4, 1e-5)
    assert.epsilonEqual(tonemap.getColorAdaptation(), 5.5, 1e-5)
    // let ldr = new cv.Mat();
    // let retval = tonemap.process(hdr, ldr);
  }
  // Inpaint
  {
    const src = new cv.Mat(100, 100, cv.CV_8UC3, new cv.Scalar(127, 127, 127, 255))
    const mask = new cv.Mat(100, 100, cv.CV_8UC1, new cv.Scalar(0, 0, 0, 0))
    const dst = new cv.Mat()
    cv.line(mask, new cv.Point(10, 50), new cv.Point(90, 50), new cv.Scalar(255, 255, 255, 255), 5)
    cv.inpaint(src, mask, dst, 3, cv.INPAINT_TELEA)
    assert.equal(dst.rows, 100)
    assert.equal(dst.cols, 100)
    assert.equal(dst.channels(), 3)

    src.delete()
    mask.delete()
    dst.delete()
  }
})
