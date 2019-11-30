#!/usr/bin/env node

const fs = require('fs')

export default class RomWriter {
  setSourceFileLocation (source) {
    this.source = source
  }

  setTargetFileLocation (target) {
    this.target = target
  }

  readSource () {
    return new Promise((resolve, reject) => {
      fs.readFile(this.source, null, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  writeTarget (buffer) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.target, buffer, { encoding: null }, err => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  async applyPatches (patches) {
    const romDataBuffer = Buffer.alloc(2048)
    ;(await this.readSource()).copy(romDataBuffer)
    patches.forEach(patch =>
      patch[1].forEach((value, index) =>
        romDataBuffer.writeUInt8(value, index + patch[0])))
    await this.writeTarget(romDataBuffer)
  }
}
