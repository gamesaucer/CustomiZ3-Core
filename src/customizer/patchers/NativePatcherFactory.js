#!/usr/bin/env node

const NativePatcher = require('./NativePatcher')

/**
 * Get a NativePatcher.
 * @param {Patch} patch - The Patch to apply to the NativePatcher
 * @returns {NativePatcher} A NativePatcher object
 */
function NativePatcherFactory (patch) {
  const patcher = new NativePatcher()
  patcher.setPatch(patch)
  return patcher
}

module.exports = NativePatcherFactory
