#!/usr/bin/env node

module.exports.getPatcher = require('./customizer/PatchFactory')
module.exports.getRomVersion = require('./versions/VersionFactory')
module.exports.getDomainList = require('./domains/DomainListFactory')
