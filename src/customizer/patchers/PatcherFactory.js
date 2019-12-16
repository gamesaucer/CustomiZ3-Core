#!/usr/bin/env node

import NativePatcherFactory from './NativePatcherFactory'

/**
  * Get a Patcher.
  * @param {*} patch - The Patch to apply to the Patcher.
  * @param {*} type - The type of Patcher to get.
  * @returns {Patcher|Function} A Patcher object or a more specific factory function.
  */
export default async function PatcherFactory (patch = null, type = null) {
  if (patch === null && type === null) return PatcherFactory
  if (type === null) return PatcherFactory.bind(this, patch)
  var factoryFunction
  switch (type) {
    case 'native':
      factoryFunction = NativePatcherFactory
      break
    default: throw Error('Unknown PatcherFactory - unable to provide PatcherFactory function.')
  }
  return patch === null ? factoryFunction : factoryFunction(patch)
}
