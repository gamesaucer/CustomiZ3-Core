#!/usr/bin/env node

import fs from 'fs'

/**
 * Module for patching and outputting a rom file.
 * @module RomWriter
 */
export default class RomWriter {
  /**
   * Configure which source file to read and patch.
   * @public
   * @param {string} source - The source path
   */
  setSourceFileLocation (source) {
    this.source = source
  }

  /**
   * Configure how large the patched rom should be
   * @public
   * @param {string} size - The size in bytes
   */
  setRomSize (size) {
    this.romSize = size
  }

  /**
   * Configure which target file to write the patched rom to.
   * @public
   * @param {string} target - The source path
   */
  setTargetFileLocation (target) {
    this.target = target
  }

  /**
   * Read the rom set as the source.
   * @private
   * @return {Promise} Resolves with file contents if successful.
   */
  readSource () {
    return new Promise((resolve, reject) => {
      fs.readFile(this.source, null, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  /**
   * Write the patched rom to the target file. For internal use.
   * @private
   * @param {Buffer} buffer - The patched rom.
   * @return {Promise} Resolves if successful.
   */
  writeTarget (buffer) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.target, buffer, { encoding: null }, err => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  /**
   * Applies a given set of patches to the rom.
   * @public
   * @param {Patch} patches - The set of patches.
   */
  async applyPatches (patches) {
    if (this.source === this.target) throw new Error('Source and target cannot be the same!')
    const romDataBuffer = Buffer.alloc(this.romSize)
    ;(await this.readSource()).copy(romDataBuffer)
    patches.forEach(patch =>
      patch[1].forEach((value, index) =>
        romDataBuffer.writeUInt8(value, index + patch[0])))
    await this.writeTarget(romDataBuffer)
  }
}
