/* global describe, it, expect */

const Patch = require('../../../src/customizer/Patch')

describe('The Patch class', () => {
  it('should allow instantiation.', () => {
    expect(new Patch()).toBeTruthy()
  })
})

describe('The addChange method, when called with a number/string', () => {
  it('should add the provided change to the Patch\'s list of changes.', () => {
    const patch = new Patch()
    patch.addChange(1, 30)
    expect(patch.changes[1]).toBe(30)
  })
  it('should overwrite previous changes targeting the same address.', () => {
    const patch = new Patch()
    patch.addChange(1, 40)
    patch.addChange(1, 50)
    expect(patch.changes[1]).toBe(50)
  })
  it('should remove any address set to itself.', () => {
    const patch = new Patch()
    patch.addChange(1, 40)
    patch.addChange(1, 1)
    expect(patch.changes[1]).toBeNull()
  })
  it('should not cast strings to numbers', () => {
    const patch = new Patch()
    patch.addChange(1, '40')
    expect(patch.changes[1]).toStrictEqual('40')
  })
})

describe('The addChange method, when called with an array', () => {
  it('should add the provided change to the Patch\'s list of changes as a bit instead of a byte.', () => {
    const patch = new Patch()
    patch.addChange(1, [30])
    patch.addChange(1, [null, 40])
    expect(patch.changes[1]).toStrictEqual([30, 40, null, null, null, null, null, null])
  })
  it('should overwrite previous changes targeting the same address.', () => {
    const patch = new Patch()
    patch.addChange(1, [40])
    patch.addChange(1, [50])
    expect(patch.changes[1]).toStrictEqual([50, null, null, null, null, null, null, null])
  })
  it('should remove any address set to itself.', () => {
    const patch = new Patch()
    patch.addChange(1, [40, 40])
    patch.addChange(1, [1])
    expect(patch.changes[1]).toStrictEqual([null, 40, null, null, null, null, null, null])
  })
  it('should not cast strings to numbers', () => {
    const patch = new Patch()
    patch.addChange(1, ['40'])
    expect(patch.changes[1]).toStrictEqual(['40', null, null, null, null, null, null, null])
  })
})

describe('The setVersion method', () => {
  it('should set the version property.', () => {
    const patch = new Patch()
    const mockVersion = { foo: 'bar' }

    patch.setVersion(mockVersion)
    expect(patch.version).toStrictEqual(mockVersion)
  })
})

describe('The getVersion method', () => {
  it('should get the version property.', () => {
    const patch = new Patch()
    const mockVersion = { foo: 'bar' }

    patch.setVersion(mockVersion)
    expect(patch.getVersion(mockVersion)).toStrictEqual(patch.version)
  })
})

describe('The getChanges method', () => {
  it('should return the list of changes', () => {
    const patch = new Patch()
    patch.addChange(1, 40)
    expect(patch.getChanges()).toStrictEqual({ 1: [40] })
  })
  it('should join adjacent changes', () => {
    const patch = new Patch()
    patch.addChange(1, 40)
    patch.addChange(2, 41)
    expect(patch.getChanges()).toStrictEqual({ 1: [40, 41] })
  })
  it('should return bits as an array of length 8', () => {
    const patch = new Patch()
    patch.addChange(1, [40])
    expect(patch.getChanges()).toStrictEqual({ 1: [[40, null, null, null, null, null, null, null]] })
  })
  it('should skip NULL changes.', () => {
    const patch = new Patch()
    patch.addChange(1, 20)
    patch.addChange(2, 30)
    patch.addChange(2, 2)
    expect(patch.getChanges()).toStrictEqual({ 1: [20] })
  })
  it('should skip changes with only NULL bits.', () => {
    const patch = new Patch()
    patch.addChange(1, 20)
    patch.addChange(2, [30])
    patch.addChange(2, [2])
    expect(patch.getChanges()).toStrictEqual({ 1: [20] })
  })
})
