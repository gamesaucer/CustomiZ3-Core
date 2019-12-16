#!/usr/bin/env node

import { promises as fs } from 'fs'
import crypto from 'crypto'

/**
 * Abstract class representing the Patcher object.
 */
export default class Patcher {
  /**
   * Throw an error if not called via super(), since the class is abstract.
   * @private
   */
  constructor () {
    if (this.constructor === Patcher) {
      throw new Error('Patcher should not be instantiated! Instantiate one of its derived classes instead.')
    }
    this.patchObject = {}
  }

  /**
   * Designate a Patch for the Patcher to use.
   * @param {Patch} patch - The Patch to use.
   * @public
   */
  setPatch (patch) {
    this.patchObject = patch
  }

  /**
   * Read data from a rom file
   * @param {String} path - The path of the file to read from.
   * @param {Boolean} [ignoreChecksum=false] - Whether to ignore a faulty checksum.
   * @returns {Promise} Promise which resolves with the data obtained from the file.
   * @private
   */
  async readSource (path, ignoreChecksum) {
    const data = await fs.readFile(path)
    if (!ignoreChecksum && crypto.createHash('md5').update(data).digest('hex') !== this.patchObject.getVersion().checksum.md5) {
      throw new Error('Source file provided does not have the correct checksum')
    }
    return data
  }

  /**
   * Write data to a target file.
   * @param {String} path - The path of the file to write to.
   * @param {Buffer} buffer - The data to write.
   * @returns {Promise} Promise which resolves when the data is written.
   * @private
   */
  async writeTarget (path, buffer) {
    return fs.writeFile(path, buffer, { encoding: null })
  }

  /**
   * Throw an error, since the method must be overridden.
   * @private
   */
  patch () {
    throw new Error('The patch method has no default behaviour and should be overridden.')
  }
}
