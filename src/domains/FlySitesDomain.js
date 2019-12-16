#!/usr/bin/env node

import path from 'path'
import Domain from './Domain'

/**
 * @classdesc Class representing the Domain for fly sites.
 * @class
 */
export default class FlySitesDomain extends Domain {
  /**
   * Read the fly sites data file.
   * @public
   */
  async init () {
    await super.init(path.join(__dirname, 'domaindata', 'flysites.json'))
  }
}
