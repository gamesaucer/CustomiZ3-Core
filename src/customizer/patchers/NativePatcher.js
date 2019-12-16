#!/usr/bin/env node

import Patcher from './Patcher'

/**
 * Class representing the NativePatcher object.
 */
export default class NativePatcher extends Patcher {
  /**
   * Compute and apply the checksum to the data and write the data to a target file.
   * @param {String} path - The path of the file to write to.
   * @param {Buffer} buffer - The data to write.
   * @returns {Promise} Promise which resolves when the data is written.
   * @private
   */
  async writeTarget (path, buffer) {
    const address = this.patchObject.getVersion().checksum.address

    const checksumBuffer = Buffer.alloc(4)
    buffer.copy(checksumBuffer, 0, address, address + 4)
    const oldSum = checksumBuffer.reduce((prev, cur) => prev + cur)
    const difference = 0x1fe - oldSum

    const sum = (buffer.reduce((prev, cur) => prev + cur) + difference) & 0xffff
    const inverse = ~sum & 0xffff
    buffer.writeUInt16LE(inverse, address)
    buffer.writeUInt16LE(sum, address + 2)
    return super.writeTarget(path, buffer)
  }

  /**
   * Patch the source file and write it to the target file.
   * @param {String} source - The path of the source file to read from.
   * @param {String} target - The path of the target file to write to.
   * @param {Boolean} [ignoreChecksum=false] - Whether to ignore a faulty checksum.
   * @returns {Promise} Promise which resolves when the data is written.
   * @public
   */
  async patch (source, target, ignoreChecksum) {
    if (source === target) throw new Error('Source and target cannot be the same!')
    const data = await this.readSource(source, ignoreChecksum)
    const changes = this.patchObject.getChanges()
    for (const target in changes) {
      changes[target].forEach((source, offset) => {
        data.writeUInt8(data.readUInt8(source), Number(target) + offset)
      })
    }
    return this.writeTarget(target, data)
  }
}
