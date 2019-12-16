/* global describe, it, expect, jest */

import NativePatcherFactory from '../../../../src/customizer/patchers/NativePatcherFactory'
import NativePatcher from '../../../../src/customizer/patchers/NativePatcher'
import Patch from '../../../../src/customizer/Patch'

jest.mock('../../../../src/customizer/Patch')
jest.mock('../../../../src/customizer/patchers/NativePatcher')

describe('The NativePatcherFactory function', () => {
  it('should return a NativePatcher', () => {
    expect(NativePatcherFactory(new Patch())).toBeInstanceOf(NativePatcher)
  })
})
