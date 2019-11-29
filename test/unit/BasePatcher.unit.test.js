/* global describe, test, expect, beforeEach, jest */

import BasePatcher from '../../module/BasePatcher.js'
import RomWriter from '../../module/RomWriter.js'

jest.mock('../../module/RomWriter.js')

beforeEach(() => {
  RomWriter.mockClear()
})

describe('The BasePatcher class should', () => {
  test('allow instantiation', () => {
    const patcher = new BasePatcher()
    expect(patcher).toBeTruthy()
  })
  test('have the method setRomWriter', () => {
    expect(BasePatcher.prototype.setRomWriter).toBeDefined()
  })
  test('have the method setGameOptions', () => {
    expect(BasePatcher.prototype.setGameOptions).toBeDefined()
  })
  test('have the method patch', () => {
    expect(BasePatcher.prototype.patch).toBeDefined()
  })
})

describe('The setRomWriter method should', () => {
  test('set the romWriter property', () => {
    const mockRomWriter = new RomWriter()
    const patcher = new BasePatcher()

    patcher.setRomWriter(mockRomWriter)

    expect(patcher.romWriter).toBe(mockRomWriter)
  })
})

describe('The setGameOptions method should', () => {
  test('set the gameOptions property', () => {
    const exampleGameOptions = 'exampleGameOptions'
    const patcher = new BasePatcher()

    patcher.setGameOptions(exampleGameOptions)

    expect(patcher.gameOptions).toBe(exampleGameOptions)
  })
})

describe('The patch method should', () => {
  test('call the romWriter method "write" once with the desired changes', () => {
    const patcher = new BasePatcher()
    const mockRomWriter = new RomWriter()

    patcher.setRomWriter(mockRomWriter)
    patcher.setGameOptions('exampleGameOptions')
    patcher.patch()

    expect(mockRomWriter.write).toHaveBeenCalledWith('exampleGameOptions')
    expect(mockRomWriter.write).toHaveBeenCalledTimes(1)
  })
})
