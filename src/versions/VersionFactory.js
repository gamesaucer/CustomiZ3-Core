#!/usr/bin/env node

const path = require('path')
const crypto = require('crypto')
const fs = require('fs').promises

const versiondir = 'versiondata'

/**
 * Get the version of a provided rom.
 * @param {String} romFilePath - File path leading to the rom
 * @returns {Object} The version object.
 * @public
 */
async function VersionFactory (romFilePath) {
  const hash = await VersionFactory.getFileChecksum(romFilePath)
  const versionList = await VersionFactory.getVersionList()
  for (const versionName of versionList) {
    const version = await VersionFactory.getVersion(path.join(__dirname, versiondir, `${versionName}.json`))
    if (version.checksum.md5 === hash) return version
  }
  throw Error('No matching version found.')
}

/**
 * Get the md5 file checksum.
 * @param {String} romFilePath - File path leading to the rom.
 * @returns {Promise} Resolves with the file hash.
 * @private
 */
VersionFactory.getFileChecksum = async function (romFilePath) {
  return crypto.createHash('md5').update(await fs.readFile(romFilePath, null)).digest('hex')
}

/**
 * Get the version from a file.
 * @param {versionFilePath} - File path leading to the version data file.
 * @returns {Promise} Resolves with the JSON.parsed contents of the data file.
 * @private
 */
VersionFactory.getVersion = async function (versionFilePath) {
  return JSON.parse(await fs.readFile(versionFilePath, 'utf-8'))
}

/**
 * Get a list of versions.
 * @returns {Promise} Resolves with a list of versions.
 * @private
 */
VersionFactory.getVersionList = async function () {
  return (await fs.readdir(path.join(__dirname, versiondir)))
    .map(filename => path.parse(filename).name)
}

module.exports = VersionFactory
