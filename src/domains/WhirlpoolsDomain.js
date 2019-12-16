#!/usr/bin/env node

import path from 'path'
import Domain from './Domain'

/**
 * @classdesc Class representing the Domain for whirlpools.
 * @class
 */
export default class WhirlpoolsDomain extends Domain {
  /**
   * Read the whirlpools data file.
   * @public
   */
  async init () {
    await super.init(path.join(__dirname, 'domaindata', 'whirlpools.json'))
  }
}
