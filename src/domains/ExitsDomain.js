#!/usr/bin/env node

const path = require('path')
const Domain = require('./Domain')

/**
 * @classdesc Class representing the Domain for exits.
 * @class
 */
class ExitsDomain extends Domain {
  /**
   * Read the exits data file.
   * @public
   */
  async init () {
    await super.init(path.join(__dirname, 'domaindata', 'exits.json'))
  }

  /**
   * Get the changes made to the exits.
   * @returns {Object} The parsed hole changes.
   * @public
   */
  getChanges () {
    const changes = {}
    Object.keys(this.changes).forEach(name => {
      changes[name] = [this.changes[name][0], null, null, null, null, null, null, null, null, null, null, null, null]
    })

    return changes
  }
}

module.exports = ExitsDomain
