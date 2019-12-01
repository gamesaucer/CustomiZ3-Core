/* global describe, it, expect, jest */

import Patch from '../../module/Patch.js'

describe('The Patch class', () => {
  it('should allow instantiation', () => {
    const patch = new Patch()
    expect(patch).toBeTruthy()
  })
  it('should have the method addPatch', () => {
    expect(Patch.prototype.addPatch).toBeDefined()
  })
  it('should have the method getPatches', () => {
    expect(Patch.prototype.getPatches).toBeDefined()
  })
  it('should have the method integratePatch', () => {
    expect(Patch.prototype.integratePatch).toBeDefined()
  })
  it('should have static fields for logical operators', () => {
    expect(Patch.AND).toBeDefined()
    expect(Patch.NAND).toBeDefined()
    expect(Patch.OR).toBeDefined()
    expect(Patch.NOR).toBeDefined()
    expect(Patch.XOR).toBeDefined()
    expect(Patch.XNOR).toBeDefined()
  })
})

describe('The addPatch method', () => {
  it('should add the provided patch to the patches property', () => {
    const patch = new Patch()
    patch.addPatch(0, [0x31, 0x32, 0x33, 0x34])
    expect(patch.patches).toStrictEqual({ 0: 0x31, 1: 0x32, 2: 0x33, 3: 0x34 })
  })
  it('should convert a string into a byte array before handling it', () => {
    const patch = new Patch()
    patch.addPatch(0, '1234')
    expect(patch.patches).toStrictEqual({ 0: 0x31, 1: 0x32, 2: 0x33, 3: 0x34 })
  })
  it('should call the integratePatch method if given a bitwise operator as a final argument', () => {
    const patch = new Patch()
    const mockIntegratePatch = jest.spyOn(patch, 'integratePatch')
    patch.addPatch(0, [0x31, 0x32, 0x33, 0x34], Patch.OR)
    expect(mockIntegratePatch).toHaveBeenCalledWith(0, [0x31, 0x32, 0x33, 0x34], Patch.OR)
  })
  it('should not call the integratePatch method if not given a final argument', () => {
    const patch = new Patch()
    const mockIntegratePatch = jest.spyOn(patch, 'integratePatch')
    patch.addPatch(0, [0x31, 0x32, 0x33, 0x34])
    expect(mockIntegratePatch).not.toHaveBeenCalled()
  })
})

describe('The getPatches method', () => {
  it('should return the patches property as an object containing arrays of bytes', () => {
    const patch = new Patch()
    patch.addPatch(0, [0x31, 0x32, 0x33, 0x34])
    expect(patch.getPatches()).toStrictEqual({ 0: [0x31, 0x32, 0x33, 0x34] })
  })
})

describe('The integratePatch method', () => {
  describe('adjusts bytes that overlap between the new and existing patches and', () => {
    it('should combine them using bitwise OR', () => {
      const patch = new Patch()
      patch.addPatch(0, [0b10111001])
      patch.addPatch(0, [0b01110010], Patch.OR)
      expect(patch.patches[0]).toBe(0b11111011)
    })

    it('should combine them using bitwise NOR', () => {
      const patch = new Patch()
      patch.addPatch(0, [0b10111001])
      patch.addPatch(0, [0b01110010], Patch.NOR)
      expect(patch.patches[0]).toBe(0b00000100)
    })

    it('should combine them using bitwise AND', () => {
      const patch = new Patch()
      patch.addPatch(0, [0b10111001])
      patch.addPatch(0, [0b01110010], Patch.AND)
      expect(patch.patches[0]).toBe(0b00110000)
    })

    it('should combine them using bitwise NAND', () => {
      const patch = new Patch()
      patch.addPatch(0, [0b10111001])
      patch.addPatch(0, [0b01110010], Patch.NAND)
      expect(patch.patches[0]).toBe(0b11001111)
    })

    it('should combine them using bitwise XOR', () => {
      const patch = new Patch()
      patch.addPatch(0, [0b10111001])
      patch.addPatch(0, [0b01110010], Patch.XOR)
      expect(patch.patches[0]).toBe(0b11001011)
    })

    it('should combine them using bitwise XNOR', () => {
      const patch = new Patch()
      patch.addPatch(0, [0b10111001])
      patch.addPatch(0, [0b01110010], Patch.XNOR)
      expect(patch.patches[0]).toBe(0b00110100)
    })
  })
  it('should not apply bitwise operators to non-overlapping bytes in the given patch', () => {
    const patch = new Patch()
    patch.addPatch(0, [0b10111001])
    patch.addPatch(0, [0b01110010, 0b01110010], Patch.AND)
    expect(patch.patches).toStrictEqual({ 0: 0b00110000, 1: 0b01110010 })
  })
  it('should return the integrated patch', () => {
    const patch = new Patch()
    patch.addPatch(0, [0b10111001])
    expect(patch.integratePatch(0, [0b01110010], Patch.OR)).toStrictEqual([0b11111011])
  })
  it('should throw if provided with an unknown operator', () => {
    const patch = new Patch()
    expect(() => patch.integratePatch(0, [], 'example')).toThrow()
  })
})
