#!/usr/bin/env node

export default class Patch {
  static get AND () { return 'AND' }
  static get NAND () { return 'NAND' }
  static get OR () { return 'OR' }
  static get NOR () { return 'NOR' }
  static get XOR () { return 'XOR' }
  static get XNOR () { return 'XNOR' }

  constructor () {
    this.patches = {}
  }

  /**
   * Adds a patch to the list that needs executing for the overarching patch
   * @public
   * @param {Number} address - Byte at which to start patching.
   * @param {(Array|String)} bytes - Bytes to write.
   * @param {(Symbol|null)} operator - Operator to apply.
   */
  addPatch (address, bytes, operator = null) {
    if (typeof bytes === 'string') bytes = [...Buffer.from(bytes, null)]
    if (operator !== null) bytes = this.integratePatch(address, bytes, operator)
    bytes.forEach((byte, index) => {
      this.patches[address + index] = byte
    })
  }

  /**
   * @todo Write method documentation
   * @public
   */
  getPatches () {
    var lastIndex
    var patches = {}
    for (var address in this.patches) {
      if (!(address - 1 in this.patches)) {
        lastIndex = address
        patches[lastIndex] = []
      }
      patches[lastIndex].push(this.patches[address])
    }
    return patches
  }

  /**
   * @todo Write method documentation
   * @private
   */
  integratePatch (address, bytes, operator) {
    var opFunc
    switch (operator) {
      case Patch.OR:
        opFunc = (a, b) => a | b
        break
      case Patch.NOR:
        opFunc = (a, b) => 0xFF - (a | b)
        break
      case Patch.AND:
        opFunc = (a, b) => a & b
        break
      case Patch.NAND:
        opFunc = (a, b) => 0xFF - (a & b)
        break
      case Patch.XOR:
        opFunc = (a, b) => a ^ b
        break
      case Patch.XNOR:
        opFunc = (a, b) => 0xFF - (a ^ b)
        break
      default:
        throw new Error('Undefined operator. Make use of the Patch.<gate> fields')
    }
    return bytes.map((byte, index) => {
      const offset = address + index
      if (!(offset in this.patches)) {
        return byte
      } else {
        return opFunc(this.patches[offset], byte)
      }
    })
  }
}
