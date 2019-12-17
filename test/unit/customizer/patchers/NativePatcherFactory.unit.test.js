/* global describe, it, expect, jest */

const NativePatcherFactory = require('../../../../src/customizer/patchers/NativePatcherFactory')
const NativePatcher = require('../../../../src/customizer/patchers/NativePatcher')
const Patch = require('../../../../src/customizer/Patch')

jest.mock('../../../../src/customizer/Patch')
jest.mock('../../../../src/customizer/patchers/NativePatcher')

describe('The NativePatcherFactory function', () => {
  it('should return a NativePatcher', () => {
    expect(NativePatcherFactory(new Patch())).toBeInstanceOf(NativePatcher)
  })
})
