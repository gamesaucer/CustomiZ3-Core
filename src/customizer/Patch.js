#!/usr/bin/env node

/**
 * Class representing the Patch object.
 */
export default class Patch {
  /**
   * Initialise instance fields
   * @public
   */
  constructor () {
    this.version = null
    this.changes = {}
  }

  /**
   * Add a change to the Patch.
   * @param {Number} address - Which address to set.
   * @param {Number|String|Array} to - What to set the address to.
   * @public
   */
  addChange (address, to) {
    if (to instanceof Array) {
      if (!(this.changes[address] instanceof Array)) {
        this.changes[address] = Array(8).fill(this.changes[address] || null)
      }
      for (const bit in to) {
        if (to[bit] !== null) this.changes[address][bit] = address === to[bit] ? null : to[bit]
      }
    } else {
      this.changes[address] = address === to ? null : to
    }
  }

  /**
   * Set the version.
   * @param {Object} version - The version object.
   * @public
   */
  setVersion (version) {
    this.version = version
  }

  /**
   * Get the version.
   * @returns {Object} The version object.
   * @public
   */
  getVersion () {
    return this.version
  }

  /**
   * Get the changes in the Patch.
   * @returns {Object} The changes in the Patch.
   * @public
   */
  getChanges () {
    var lastIndex
    const combinedChanges = {}
    for (var address in this.changes) {
      if (this.changes[address] === null || (
        this.changes[address] instanceof Array &&
        this.changes[address].every(val => val === null))
      ) {
        continue
      }
      if (!(address - 1 in this.changes)) {
        lastIndex = address
        combinedChanges[lastIndex] = []
      }
      combinedChanges[lastIndex].push(this.changes[address])
    }
    return combinedChanges
  }
}
