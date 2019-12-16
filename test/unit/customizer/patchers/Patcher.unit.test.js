/* global describe, it, expect, jest, beforeEach */

import Patcher from '../../../../src/customizer/patchers/Patcher'
import { promises as fs } from 'fs'

const MockPatcher = class extends Patcher {}
const mockVersion = { checksum: { md5: 'mockHex' } }
const mockHash = { update: () => mockHash, digest: () => 'mockHex' }
jest.mock('crypto', () => ({ createHash: () => mockHash }))
beforeEach(() => jest.clearAllMocks())

describe('The NativePatcher class', () => {
  it('should allow instantiation', () => {
    expect(() => new Patcher()).toThrow()
  })
})

describe('The setPatch method', () => {
  it('should set the patchObject property', () => {
    const patcher = new MockPatcher()
    const testPatch = { foo: 'bar' }
    patcher.setPatch(testPatch)

    expect(patcher.patchObject).toBe(testPatch)
  })
})

describe('The readSource method', () => {
  it('should throw if the version checksum is incorrect', () => {
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue('')
    const patcher = new MockPatcher()
    patcher.patchObject.getVersion = () => { return { checksum: { md5: 'wrongHex' } } }

    expect(patcher.readSource()).rejects.toThrow()
    mockReadFile.mockRestore()
  })
  it('should not throw if the version checksum is incorrect but the ignoreChecksum flag is set', () => {
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue('')
    const patcher = new MockPatcher()
    patcher.patchObject.getVersion = () => { return { checksum: { md5: 'wrongHex' } } }

    expect(patcher.readSource('', true)).resolves.not.toThrow()
    mockReadFile.mockRestore()
  })
  it('should read from the provided source file', async done => {
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue('')
    const examplePath = 'examplePath'
    const patcher = new MockPatcher()
    patcher.patchObject.getVersion = () => mockVersion

    await patcher.readSource(examplePath)
    expect(mockReadFile).toHaveBeenCalledWith(examplePath)
    mockReadFile.mockRestore()
    done()
  })
  it('should throw if reading fails', () => {
    const mockReadFile = jest.spyOn(fs, 'readFile').mockRejectedValue(new Error())
    const patcher = new MockPatcher()
    patcher.patchObject.getVersion = () => mockVersion

    expect(patcher.readSource()).rejects.toThrow()
    mockReadFile.mockRestore()
  })
})

describe('The writeTarget method', () => {
  it('should write to the provided target file', async done => {
    const mockWriteFile = jest.spyOn(fs, 'writeFile').mockResolvedValue()
    const examplePath = 'examplePath'
    const exampleContents = 'exampleContents'
    const patcher = new MockPatcher()

    await patcher.writeTarget(examplePath, exampleContents)
    expect(mockWriteFile).toHaveBeenCalledWith(examplePath, exampleContents, { encoding: null })
    mockWriteFile.mockRestore()
    done()
  })
  it('should throw if writing fails', () => {
    const mockWriteFile = jest.spyOn(fs, 'writeFile').mockRejectedValue(new Error())
    const patcher = new MockPatcher()

    expect(patcher.writeTarget()).rejects.toThrow()
    mockWriteFile.mockRestore()
  })
})

describe('The patch method', () => {
  it('should throw', () => {
    const patcher = new MockPatcher()
    expect(() => patcher.patch()).toThrow()
  })
})
