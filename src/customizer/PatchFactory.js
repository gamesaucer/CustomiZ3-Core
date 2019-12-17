#!/usr/bin/env node

const PatcherFactory = require('./patchers/PatcherFactory')
const Patch = require('./Patch')

/**
 * Get a Patch.
 * @param {Object} domains - A list of domains to apply to the rom.
 * @param {Object} version - The version to use.
 * @returns {PatcherFactory} A PatcherFactory partially applied with the resulting Patch.
 * @public
 */
async function PatchFactory (domains, version) {
  const patch = new Patch()
  patch.setVersion(version)
  const patchData =
    Object.keys(domains).flatMap((name, index) =>
      patchDomain(
        domains[name].getChanges(),
        domains[name].getDataFormat(),
        getFormatOffsets(
          domains[name].getDataFormat(),
          version.offset[name])))

  patchData.forEach(data => patch.addChange(...data))
  const factory = await PatcherFactory(patch, null)
  return factory
}

/**
 * Get a fully calculated lookup table for addresses relating to a Domain
 * @param {Object} format - The format of the current Domain.
 * @param {Number} versionOffset - The address offset this rom version uses for this Domain.
 * @returns {Array} The table containing the offsets.
 * @private
 */
function getFormatOffsets (format, versionOffset) {
  const sum = (total, value) => total + value
  const recordOffsets = []
  for (const record in format.records) {
    const columnOffsets = []
    const baseColumnOffset =
      versionOffset +
      format.size.reduce(sum) * record +
      [0, ...format.spacing].slice(0, Number(record) + 1).reduce(sum)

    for (const column in format.size) {
      columnOffsets.push(
        baseColumnOffset +
        [0, ...format.size].slice(0, Number(column) + 1).reduce(sum))
    }
    recordOffsets.push(columnOffsets)
  }
  return recordOffsets
}

/**
 * Get the offsets related to a certain record.
 * @param {String} reference - The name of the record being retrieved.
 * @param {Array} records - The ordered list of record names for the current Domain.
 * @param {Array} offsets - The table of offsets for the current Domain.
 * @returns {Array} - The list of offsets for the requested record.
 * @private
 */
function getAddressesTo (reference, records, offsets) {
  const index = records.indexOf(reference)
  if (index < 0) throw new Error(`${reference} does not exist!`)
  return offsets[index]
}

/**
 * Calculate the Patch data from Domain data.
 * @param {Object} changes - The changes from this Domain.
 * @param {Object} format - The data format for this Domain.
 * @param {Array} offsets - The table containing the offsets for this Domain.
 * @returns {Array} - List of addresses to patch.
 * @private
 */
function patchDomain (changes, format, offsets) {
  // console.log(changes, format, offsets)
  const patchData = []
  for (const key in changes) {
    const record = changes[key]
    const target = getAddressesTo(key, format.records, offsets)
    for (const column in record) {
      if (record[column] === null) continue
      var source
      try {
        source = getAddressesTo(record[column], format.records, offsets)[column]
      } catch (_err) {
        source = Buffer.alloc(format.size[column])
        if (typeof record[column] === 'number') {
          const stringSize = format.size[column] * 2
          const paddedString = record[column].toString(16).padStart(stringSize, '0')
          const trimmedString = paddedString.substring(paddedString.length - stringSize)
          source.write(trimmedString, 'hex')
        } else {
          source.write(record[column])
        }
      }
      patchData.push(...patchColumn(source, target[column], format.size[column]))
    }
  }
  return patchData
}

/**
 * Calculate the Patch data for a single piece of data.
 * @param {Buffer|Number} source - Source to set the target to.
 * @param {Number} target - Address that should use the source to set its data.
 * @param {Number} length - The length in bytes of the data.
 * @returns {Array} - List of addresses to patch.
 * @private
 */
function patchColumn (source, target, length) {
  var patchData = []
  for (var byte = 0; byte < length; ++byte) {
    patchData.push([
      target + byte,
      source instanceof Buffer
        ? source.readUInt8(byte).toString(16)
        : source + byte
    ])
  }
  return patchData
}

module.exports = PatchFactory
