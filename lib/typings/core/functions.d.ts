import { int } from './_types'
import { Mat } from './Mat'
import { MinMaxLocLike } from './valueObjects'


// function("minMaxLoc", select_overload<binding_utils::MinMaxLoc(const cv::Mat&)>(&binding_utils::minMaxLoc_1));
// function("minMaxLoc", select_overload<binding_utils::MinMaxLoc(const cv::Mat&, const cv::Mat&)>(&binding_utils::minMaxLoc));
export function minMaxLoc(src: Mat, mask?: Mat): MinMaxLocLike

//  function("CV_MAT_DEPTH", &binding_utils::cvMatDepth);
export function CV_MAT_DEPTH(flags: int): int

// function("getBuildInformation", &binding_utils::getBuildInformation);
export function getBuildInformation(): string
