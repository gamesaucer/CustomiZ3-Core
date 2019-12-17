#!/usr/bin/env node

const fs = require('fs').promises

/**
 * @classdesc Abstract class representing the Domain object.
 * @class
 */
class Domain {
  /**
   * Throw an error if not called via super() since the class is abstract.
   * @private
   */
  constructor () {
    if (this.constructor === Domain) {
      throw new Error('Domain should not be instantiated! Instantiate one of its derived classes instead.')
    }
    this.changes = {}
  }

  /**
   * Read the data file associated with the Domain.
   * @param {String} file - The filename.
   * @public
   */
  async init (file) {
    const json = await fs.readFile(file, 'utf-8') // this.readSource(file)
    this.dataFormat = JSON.parse(json)
    this.fixFormat()
  }

  /**
   * Check to see if the Domain has been initialised before carrying out an operation.
   * @param {Function} cb - The function to call if successful.
   * @return {*} - The return value of the passed cb function.
   * @public
   */
  ifInitialised (cb) {
    if (this.dataFormat === undefined) {
      throw new Error('Domain has not yet been initialised!')
    }
    return cb()
  }

  /**
   * Get the data format from the retrieved data file.
   * @returns {Object} The data format.
   * @public
   */
  getDataFormat () {
    return this.ifInitialised(() => this.dataFormat)
  }

  /**
   * Add a set of changes via the Domain.
   * @param {Object} changes - The changes to add in key/value pairs.
   * @public
   */
  addChanges (changes) {
    Object.assign(this.changes, this.fixChanges(changes))
  }

  /**
   * Get the changes via the Domain
   * @returns {Object} The previously applied changes.
   * @public
   */
  getChanges () {
    return this.changes
  }

  /**
   * Calculate the fully expanded Array values for the Domain format.
   * @private
   */
  fixFormat () {
    if (!(this.dataFormat.size instanceof Array)) this.dataFormat.size = [this.dataFormat.size]
    if (!(this.dataFormat.spacing instanceof Array)) this.dataFormat.spacing = [this.dataFormat.spacing]
    this.dataFormat.size = this.padArrayToLength(this.dataFormat.size, this.dataFormat.columns)
    this.dataFormat.spacing = this.padArrayToLength(this.dataFormat.spacing, this.dataFormat.columns - 1)
  }

  /**
   * Calculate the fully expanded Array values for the provided changes.
   * @param {Object} changes - The changes to expand in key/value pairs.
   * @returns {Object} The expanded changes.
   * @private
   */
  fixChanges (changes) {
    for (const change in changes) {
      if (!(changes[change] instanceof Array)) changes[change] = [changes[change]]
      changes[change] = this.padArrayToLength(changes[change], this.dataFormat.columns)
    }
    return changes
  }

  /**
   * Pad an array to a certain length by repeating the last element.
   * @param {Array} array - The array to pad.
   * @param {Number} length - The length to pad the array to.
   * @returns {Array} The padded array.
   * @private
   */
  padArrayToLength (array, length) {
    const newArray = [...array]
    if (array.length < length) {
      newArray.push(...Array(length - array.length).fill(array[array.length - 1]))
    }
    return newArray
  }
}

module.exports = Domain
