#!/usr/bin/env node

import NativePatcher from './NativePatcher'

/**
 * Get a NativePatcher.
 * @param {Patch} patch - The Patch to apply to the NativePatcher
 * @returns {NativePatcher} A NativePatcher object
 */
export default function NativePatcherFactory (patch) {
  const patcher = new NativePatcher()
  patcher.setPatch(patch)
  return patcher
}
