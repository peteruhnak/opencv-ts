// For a more complete typed emscripten module see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/emscripten/index.d.ts

// Here are only things used by the opencv test set (copied from opencv repo), or missing things (such as emscripten vector wrappers).

export function _malloc(size: number): number
export function _free(ptr: number): void

export const HEAP8: Int8Array
export const HEAPU8: Uint8Array
export const HEAPU32: Uint32Array

export class EmClassHandle {
  clone(): EmClassHandle
  delete(): void
  deleteLater(): unknown
  isAliasOf(other: unknown): boolean
  isDeleted(): boolean
}

export class EmVector<T> extends EmClassHandle {
  delete(): void
  get(pos: number): T
  push_back(value: T): void
  resize(n: number, val: T): void
  set(pos: number, value: T): boolean
  size(): number
}