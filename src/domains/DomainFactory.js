#!/usr/bin/env node

const HolesDomain = require('./HolesDomain')
const FlySitesDomain = require('./FlySitesDomain')
const WhirlpoolsDomain = require('./WhirlpoolsDomain')
const EntrancesDomain = require('./EntrancesDomain')

/**
 * Get a Domain based on its name.
 * @param {String} domain - The name of the Domain type to retrieve
 * @return {Domain} The requested Domain.
 * @public
 */
async function DomainFactory (domain) {
  var domainInstance
  switch (domain) {
    case 'holes':
      domainInstance = new HolesDomain()
      break
    case 'flysites':
      domainInstance = new FlySitesDomain()
      break
    case 'whirlpools':
      domainInstance = new WhirlpoolsDomain()
      break
    case 'entrances':
      domainInstance = new EntrancesDomain()
      break
    default:
      throw new Error('Unknown Domain - unable to provide a Domain instance.')
  }
  await domainInstance.init()
  return domainInstance
}

module.exports = DomainFactory
