#!/usr/bin/env node

const path = require('path')
const Domain = require('./Domain')

/**
 * @classdesc Class representing the Domain for whirlpools.
 * @class
 */
class WhirlpoolsDomain extends Domain {
  /**
   * Read the whirlpools data file.
   * @public
   */
  async init () {
    await super.init(path.join(__dirname, 'domaindata', 'whirlpools.json'))
  }

  /**
   * Get the changes made to the whirlpools.
   * @returns {Object} The parsed whirlpool changes.
   * @public
   */
  getChanges () {
    const changes = {}
    for (const key in this.changes) {
      changes[key] = this.changes[key].slice()
      const values = changes[key]
      for (const index in values) {
        const indexof = this.dataFormat.records.indexOf(values[index])
        if (indexof === -1) continue
        const relative = indexof % 2 === 0 ? 1 : -1
        values[index] = this.dataFormat.records[indexof + relative]
      }
    }
    return changes
  }
}

module.exports = WhirlpoolsDomain
