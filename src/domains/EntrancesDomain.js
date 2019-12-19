#!/usr/bin/env node

const path = require('path')
const Domain = require('./Domain')

/**
 * @classdesc Class representing the Domain for entrances.
 * @class
 */
class EntrancesDomain extends Domain {
  /**
   * Read the entrances data file.
   * @public
   */
  async init () {
    await super.init(path.join(__dirname, 'domaindata', 'entrances.json'))
  }

  /**
   * Get the changes made to the entrances.
   * @returns {Object} The parsed hole changes.
   * @public
   */
  getChanges () {
    const changes = {}
    Object.keys(this.changes).forEach(name => {
      changes[name] = [null, null, this.changes[name][2]]
    })

    return changes
  }
}

module.exports = EntrancesDomain
