#!/usr/bin/env node

/* const PatchFactory = require('./customizer/PatchFactory')
const VersionFactory = require('./versions/VersionFactory')
const DomainListFactory = require('./domains/DomainListFactory') */

module.exports.getPatcher = require('./customizer/PatchFactory')
module.exports.getRomVersion = require('./versions/VersionFactory')
module.exports.getDomainList = require('./domains/DomainListFactory')

/* export {
  getPatcher,
  getRomVersion,
  getDomainList
}

export default {
  getPatcher,
  getRomVersion,
  getDomainList
} */
