#!/usr/bin/env node

import path from 'path'
import Domain from './Domain'

/**
 * Class representing the Domain for holes.
 */
export default class HolesDomain extends Domain {
  /**
   * Read the holes data file.
   * @public
   */
  async init () {
    await super.init(path.join(__dirname, 'domaindata', 'holes.json'))
  }

  /**
   * Get the changes made to the holes.
   * @returns {Object} The parsed hole changes.
   * @public
   */
  getChanges () {
    const changes = {}
    Object.keys(this.changes).forEach(name => {
      changes[name] = [null, null, this.changes[name][2]]
    })

    this.dataFormat.records.forEach(name => {
      const regex = /\d+$/
      if (regex.test(name)) {
        const basename = name.replace(regex, '')
        if (basename in changes) {
          changes[name] = changes[basename]
        }
      }
    })

    return changes
  }
}
