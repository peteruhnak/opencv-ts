from os import replace
import sys
import os.path
import re

def main(opencv_path: str, build_js_path: str, ts_gen_path: str, replace_wsl: bool=False):
    hdr_parser_path = opencv_path + "/modules/python/src2/hdr_parser.py"
    jsgen_path = opencv_path + "/modules/js/generator"
    white_list_path = opencv_path + "/platforms/js/opencv_js.config.py"
    core_bindings_cpp_path = opencv_path + "/modules/js/src/core_bindings.cpp"

    headers_path = build_js_path + "/modules/js_bindings_generator/headers.txt"
    bindings_cpp_path = (
        build_js_path + "/modules/js_bindings_generator/gen/bindings2.cpp"
    )

    sys.path.append(jsgen_path)
    sys.path.append(os.path.dirname(hdr_parser_path))

    import jsgen
    import tsgen

    headers = open(headers_path, "r").read().split(";")
    if replace_wsl:
      # replace `/mnt/<drive>/path` as `<drive>:/path`
      match = re.match('/mnt/([a-z])/', headers[0])
      if match:
        headers = [h.replace(match[0], match[1] + ':/') for h in headers]

    modules_white_list = jsgen.load_white_list(white_list_path)

    generator = jsgen.JSWrapperGenerator()
    generator.gen(
        bindings_cpp_path, headers, core_bindings_cpp_path, modules_white_list
    )

    ts_generator = tsgen.TsGen(
        output_dir=ts_gen_path,
        generator=generator,
        modules_white_list=modules_white_list,
    )
    ts_generator.gen()
    print("done")


if __name__ == "__main__":
    opencv_path = "D:/prog/opencv"
    build_js_path = "D:/prog/github/build_js"
    ts_gen_path = "D:/prog/opencv-ts/lib/typings/gen"
    main(opencv_path=opencv_path, build_js_path=build_js_path, ts_gen_path=ts_gen_path, replace_wsl=True)