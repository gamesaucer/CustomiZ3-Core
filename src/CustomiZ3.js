#!/usr/bin/env node

import PatchFactory from './customizer/PatchFactory'
import VersionFactory from './versions/VersionFactory'
import DomainListFactory from './domains/DomainListFactory'

const getPatcher = PatchFactory
const getRomVersion = VersionFactory
const getDomainList = DomainListFactory

export {
  getPatcher,
  getRomVersion,
  getDomainList
}

export default {
  getPatcher,
  getRomVersion,
  getDomainList
}
