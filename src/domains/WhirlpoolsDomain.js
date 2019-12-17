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
}

module.exports = WhirlpoolsDomain
