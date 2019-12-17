#!/usr/bin/env node

const DomainFactory = require('./DomainFactory')

/**
 * Get a list of Domains based on a list of desired changes.
 * @param {Object} change - The desired changes.
 * @return {Object} The requested list of Domains.
 * @public
 */
async function DomainListFactory (changes) {
  const domainNames = Object.keys(changes)
  const domainArray = await Promise.all(domainNames.map(domain => DomainFactory(domain)))
  const domains = {}
  domainNames.forEach((name, index) => {
    domainArray[index].addChanges(changes[name])
    domains[name] = domainArray[index]
  })
  return domains
}

module.exports = DomainListFactory
