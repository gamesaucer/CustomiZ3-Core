#!/usr/bin/env node

import HolesDomain from './HolesDomain'
import FlySitesDomain from './FlysitesDomain'
import WhirlpoolsDomain from './WhirlpoolsDomain'

/**
 * Get a Domain based on its name.
 * @param {String} domain - The name of the Domain type to retrieve
 * @return {Domain} The requested Domain.
 * @public
 */
export default async function DomainFactory (domain) {
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
    default:
      throw new Error('Unknown Domain - unable to provide a Domain instance.')
  }
  await domainInstance.init()
  return domainInstance
}
