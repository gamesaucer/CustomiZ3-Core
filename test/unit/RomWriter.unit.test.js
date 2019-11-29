/* global describe, test, expect, */

import RomWriter from '../../module/RomWriter.js'

describe('The RomWriter class should', () => {
  test('allow instantiation', () => {
    const romWriter = new RomWriter()
    expect(romWriter).toBeTruthy()
  })
  test('have the method write', () => {
    expect(RomWriter.prototype.write).toBeDefined()
  })
  test('have the method setSourceFileLocation', () => {
    expect(RomWriter.prototype.setSourceFileLocation).toBeDefined()
  })
  test('have the method setTargetFileLocation', () => {
    expect(RomWriter.prototype.setTargetFileLocation).toBeDefined()
  })
})

describe('The setSourceFileLocation method should', () => {
  test('set the source property', () => {
    const examplePath = 'examplePath'
    const romWriter = new RomWriter()

    romWriter.setSourceFileLocation(examplePath)

    expect(romWriter.source).toBe(examplePath)
  })
})

describe('The setTargetFileLocation method should', () => {
  test('set the target property', () => {
    const examplePath = 'examplePath'
    const romWriter = new RomWriter()

    romWriter.setTargetFileLocation(examplePath)

    expect(romWriter.target).toBe(examplePath)
  })
})
