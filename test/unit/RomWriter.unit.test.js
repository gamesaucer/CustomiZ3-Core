/* global describe, it, expect, jest, beforeEach */

import RomWriter from '../../module/RomWriter'
import Patch from '../../module/Patch'
import fs from 'fs'

jest.mock('../../module/Patch.js')

beforeEach(() => {
  Patch.mockClear()
})

describe('The RomWriter class', () => {
  it('should allow instantiation', () => {
    const romWriter = new RomWriter()
    expect(romWriter).toBeTruthy()
  })
  it('should have the method applyPatches', () => {
    expect(RomWriter.prototype.applyPatches).toBeDefined()
  })
  it('should have the method setSourceFileLocation', () => {
    expect(RomWriter.prototype.setSourceFileLocation).toBeDefined()
  })
  it('should have the method setTargetFileLocation', () => {
    expect(RomWriter.prototype.setTargetFileLocation).toBeDefined()
  })
  it('should have the method setRomSize', () => {
    expect(RomWriter.prototype.setRomSize).toBeDefined()
  })
  it('should have the method readSource', () => {
    expect(RomWriter.prototype.readSource).toBeDefined()
  })
  it('should have the method writeTarget', () => {
    expect(RomWriter.prototype.writeTarget).toBeDefined()
  })
})

describe('The setSourceFileLocation method', () => {
  it('should set the source property', () => {
    const examplePath = 'examplePath'
    const romWriter = new RomWriter()

    romWriter.setSourceFileLocation(examplePath)
    expect(romWriter.source).toBe(examplePath)
  })
})

describe('The setTargetFileLocation method', () => {
  it('should set the target property', () => {
    const examplePath = 'examplePath'
    const romWriter = new RomWriter()

    romWriter.setTargetFileLocation(examplePath)
    expect(romWriter.target).toBe(examplePath)
  })
})

describe('The setRomSize method', () => {
  it('should set the romSize property', () => {
    const romWriter = new RomWriter()
    romWriter.setRomSize(1234)
    expect(romWriter.romSize).toBe(1234)
  })
})

describe('The readSource method', () => {
  it('should read from the provided source file', done => {
    const examplePath = 'examplePath'
    const romWriter = new RomWriter()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockImplementation((_1, _2, cb) => { cb(null, Buffer.alloc(8)) })

    romWriter.setSourceFileLocation(examplePath)
    romWriter.readSource().then(() => {
      expect(mockReadFile).toHaveBeenCalledWith(examplePath, null, expect.anything())
      done()
    }).catch((error) => {
      done(error)
    }).finally(() => {
      mockReadFile.mockReset()
    })
  })
  it('should throw an error if reading fails', () => {
    const romWriter = new RomWriter()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockImplementation((_1, _2, cb) => { cb(new Error()) })
    expect(romWriter.readSource()).rejects.toThrow()
    mockReadFile.mockReset()
  })
})

describe('The writeTarget method', () => {
  it('should write to the provided target file', done => {
    const examplePath = 'examplePath'
    const romWriter = new RomWriter()
    const newBuffer = Buffer.alloc(8)
    const mockWriteFile = jest.spyOn(fs, 'writeFile').mockImplementation((_1, _2, _3, cb) => { cb(null) })

    romWriter.setTargetFileLocation(examplePath)
    romWriter.writeTarget(newBuffer).then(() => {
      expect(mockWriteFile).toHaveBeenCalledWith(examplePath, newBuffer, expect.anything(), expect.anything())
      done()
    }).catch((error) => {
      done(error)
    })
  })
  it('should throw an error if writing fails', () => {
    const romWriter = new RomWriter()
    const mockWriteFile = jest.spyOn(fs, 'writeFile').mockImplementation((_1, _2, _3, cb) => { cb(new Error()) })
    expect(romWriter.writeTarget(Buffer.alloc(8))).rejects.toThrow()
    mockWriteFile.mockReset()
  })
})

describe('The applyPatches method', () => {
  it('should write the patched source rom to the target file', done => {
    const romWriter = new RomWriter()
    const newBuffer = Buffer.alloc(2048)
    const mockPatch = new Patch()
    const mockReadSource = jest.spyOn(romWriter, 'readSource').mockResolvedValue(newBuffer)
    const mockWriteTarget = jest.spyOn(romWriter, 'writeTarget').mockResolvedValue()
    jest.spyOn(mockPatch, 'getPatches').mockReturnValue({ 0x00: [0x31, 0x32, 0x33, 0x34] })

    newBuffer.write('1234', 0, 4, null)
    romWriter.setSourceFileLocation('source')
    romWriter.setTargetFileLocation('target')
    romWriter.setRomSize(2048)
    romWriter.applyPatches(mockPatch).then(() => {
      expect(mockReadSource).toHaveBeenCalled()
      expect(mockWriteTarget).toHaveBeenCalledWith(newBuffer)
      done()
    }).catch((error) => {
      done(error)
    })
  })
  it('should throw an error if source and target are the same', () => {
    const examplePath = 'examplePath'
    const romWriter = new RomWriter()

    jest.spyOn(romWriter, 'readSource').mockResolvedValue()
    jest.spyOn(romWriter, 'writeTarget').mockResolvedValue()
    romWriter.setTargetFileLocation(examplePath)
    romWriter.setSourceFileLocation(examplePath)
    expect(romWriter.applyPatches(new Patch())).rejects.toThrow()
  })
})
