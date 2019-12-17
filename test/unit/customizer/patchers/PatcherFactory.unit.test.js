/* global describe, it, expect, jest, beforeEach */

const PatcherFactory = require('../../../../src/customizer/patchers/PatcherFactory')
const NativePatcherFactory = require('../../../../src/customizer/patchers/NativePatcherFactory')
const Patcher = require('../../../../src/customizer/patchers/Patcher')
const Patch = require('../../../../src/customizer/Patch')

const MockPatcher = class extends Patcher {}

const MockPatcherFactory = jest.fn((a) =>
  a !== null ? new MockPatcher() : MockPatcherFactory
)

jest.mock('../../../../src/customizer/Patch')
jest.mock('../../../../src/customizer/patchers/NativePatcherFactory', () => (a) => MockPatcherFactory(a))

beforeEach(() => jest.clearAllMocks())

const patchers = {
  native: NativePatcherFactory
}

const names = {
  native: 'Native'
}

describe('The PatcherFactory function', () => {
  it('should throw if invalid arguments are given.', async done => {
    await expect(PatcherFactory(null, 'invalidType')).rejects.toThrow()
    done()
  })
  it('should return itself if no arguments are given.', async done => {
    await expect(PatcherFactory()).resolves.toStrictEqual(PatcherFactory)
    done()
  })
  it('should return a partially applied function if only a patch is given.', async done => {
    const patch = new Patch()
    const partial = await PatcherFactory(patch, null)
    const full = await partial('native')
    const total = await PatcherFactory(patch, 'native')

    expect(partial).toBeInstanceOf(Function)
    expect(full).toStrictEqual(total)
    done()
  })
  for (const name in patchers) {
    it(`should return a ${names[name]}PatcherFactory function if only type "${name}" is given`, async done => {
      const partial = await PatcherFactory(null, name)

      expect(partial).toBeInstanceOf(Function)
      expect(partial).toStrictEqual(patchers[name])
      done()
    })
    it(`should return a Patcher if both a patch and type "${name}" are given`, async done => {
      const patch = new Patch()
      const full = await PatcherFactory(patch, name)

      expect(full).toBeInstanceOf(MockPatcher)
      done()
    })
  }
})
