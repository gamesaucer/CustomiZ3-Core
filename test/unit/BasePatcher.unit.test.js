/* global describe, it, expect, beforeEach, jest */

import BasePatcher from '../../module/BasePatcher.js'
import RomWriter from '../../module/RomWriter.js'

jest.mock('../../module/RomWriter.js')

beforeEach(() => {
  RomWriter.mockClear()
})

describe('The BasePatcher class', () => {
  it('should allow instantiation', () => {
    const patcher = new BasePatcher()
    expect(patcher).toBeTruthy()
  })
  it('should have the method setRomWriter', () => {
    expect(BasePatcher.prototype.setRomWriter).toBeDefined()
  })
  it('should have the method setGameOptions', () => {
    expect(BasePatcher.prototype.setGameOptions).toBeDefined()
  })
  it('should have the method patch', () => {
    expect(BasePatcher.prototype.patch).toBeDefined()
  })
})

describe('The setRomWriter method', () => {
  it('should set the romWriter property', () => {
    const mockRomWriter = new RomWriter()
    const patcher = new BasePatcher()

    patcher.setRomWriter(mockRomWriter)

    expect(patcher.romWriter).toBe(mockRomWriter)
  })
})

describe('The setGameOptions method', () => {
  it('should set the gameOptions property', () => {
    const exampleGameOptions = 'exampleGameOptions'
    const patcher = new BasePatcher()

    patcher.setGameOptions(exampleGameOptions)

    expect(patcher.gameOptions).toBe(exampleGameOptions)
  })
})

describe('The patch method', () => {
  it('should call the romWriter method "applyPatches" once with the desired changes', () => {
    const patcher = new BasePatcher()
    const mockRomWriter = new RomWriter()

    patcher.setRomWriter(mockRomWriter)
    patcher.setGameOptions('exampleGameOptions')
    patcher.patch()

    expect(mockRomWriter.applyPatches).toHaveBeenCalledWith('exampleGameOptions')
    expect(mockRomWriter.applyPatches).toHaveBeenCalledTimes(1)
  })
})
