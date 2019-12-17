/* global describe, it, expect, jest, beforeEach */

const Patcher = require('../../../../src/customizer/patchers/Patcher')
const NativePatcher = require('../../../../src/customizer/patchers/NativePatcher')

const mockWriteTarget = jest.fn()
const mockReadSource = jest.fn()
jest.mock('../../../../src/customizer/patchers/Patcher', () => class {
  writeTarget (...args) { mockWriteTarget(...args) }
  readSource (...args) { mockReadSource(...args) }
})
beforeEach(() => jest.clearAllMocks())

const mockVersion = {
  checksum: {
    address: 0
  }
}

describe('The NativePatcher class', () => {
  it('should allow instantiation', () => {
    // console.log(require('../../../../src/customizer/patchers/Patcher')())
    expect(new NativePatcher()).toBeTruthy()
  })
  it('should extend Patcher', () => {
    expect(Object.getPrototypeOf(NativePatcher)).toStrictEqual(Patcher)
  })
})

describe('The writeTarget method', () => {
  it('should call its super method', async done => {
    const patcher = new NativePatcher()
    const examplePath = 'examplePath'
    const exampleBuffer = Buffer.alloc(12)

    patcher.patchObject = { getVersion: () => mockVersion }
    await patcher.writeTarget(examplePath, exampleBuffer)

    expect(mockWriteTarget).toHaveBeenCalledWith(examplePath, exampleBuffer)
    done()
  })
  it('should correct the rom\'s checksum values', async done => {
    const patcher = new NativePatcher()
    const examplePath = 'examplePath'
    const correctedBuffer = Buffer.from('Lorem ipsum dolor sit amet')

    patcher.patchObject = { getVersion: () => ({ checksum: { address: 0 } }) }
    correctedBuffer.writeUInt16LE(0x0a30, 2)
    correctedBuffer.writeUInt16LE(0xf5cf)
    await patcher.writeTarget(examplePath, Buffer.from('Lorem ipsum dolor sit amet'))

    expect(mockWriteTarget).toHaveBeenCalledWith(examplePath, correctedBuffer)
    done()
  })
})

describe('The patch method', () => {
  it('should throw if target and source are the same', async done => {
    const patcher = new NativePatcher()
    jest.spyOn(patcher, 'readSource').mockResolvedValue()
    jest.spyOn(patcher, 'writeTarget').mockResolvedValue()
    const examplePath = 'example'

    expect(patcher.patch(examplePath, examplePath)).rejects.toThrow()
    done()
  })
  it('should create the patched rom using the patch and the rom', async done => {
    const patcher = new NativePatcher()
    const exampleSource = 'exampleSource'
    const exampleTarget = 'exampleTarget'
    const exampleChecksumFlag = 'exampleChecksumFlag'
    const mockReadSource = jest.spyOn(patcher, 'readSource').mockResolvedValue(Buffer.from('Lorem ipsum dolor sit amet'))
    const mockWriteTarget = jest.spyOn(patcher, 'writeTarget').mockResolvedValue()
    const mockPatch = { getChanges: () => ({ 0: [6, 7, 8, 9, 10] }) }

    patcher.patchObject = mockPatch
    await patcher.patch(exampleSource, exampleTarget, exampleChecksumFlag)

    expect(mockReadSource).toHaveBeenCalledWith(exampleSource, exampleChecksumFlag)
    expect(mockWriteTarget).toHaveBeenCalledWith(exampleTarget, Buffer.from('ipsum ipsum dolor sit amet'))
    done()
  })
})
