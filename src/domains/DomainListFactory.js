#!/usr/bin/env node

import DomainFactory from './DomainFactory'

export default async function DomainListFactory (changes) {
  const domainNames = Object.keys(changes)
  const domainArray = await Promise.all(domainNames.map(domain => DomainFactory(domain)))
  const domains = {}
  domainNames.forEach((name, index) => {
    domainArray[index].addChanges(changes[name])
    domains[name] = domainArray[index]
  })
  return domains
}
