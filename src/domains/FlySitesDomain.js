#!/usr/bin/env node

const path = require('path')
const Domain = require('./Domain')

/**
 * @classdesc Class representing the Domain for fly sites.
 * @class
 */
class FlySitesDomain extends Domain {
  /**
   * Read the fly sites data file.
   * @public
   */
  async init () {
    await super.init(path.join(__dirname, 'domaindata', 'flysites.json'))
  }
}

module.exports = FlySitesDomain
