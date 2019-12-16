/* global describe, it, expect, jest */

import { promises as fs } from 'fs'

import CustomiZ3 from '../../src/CustomiZ3'
import Domain from '../../src/domains/Domain'
import Patcher from '../../src/customizer/patchers/Patcher'

describe('The getRomVersion function', () => {
  it('should calculate the checksum of the provided rom file and return the corresponding version file', async done => {
    const mockReaddir = jest.spyOn(fs, 'readdir').mockResolvedValue(['1'])
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(
      '{"checksum":{"md5":"acbd18db4cc2f85cedef654fccc4a4d8",' +
      '"address":32732},"offset": {"holes":899072}}'
    ).mockResolvedValueOnce('foo')

    expect(await CustomiZ3.getRomVersion('')).toStrictEqual(
      { checksum: { md5: 'acbd18db4cc2f85cedef654fccc4a4d8', address: 32732 }, offset: { holes: 899072 } }
    )
    mockReaddir.mockRestore()
    mockReadFile.mockRestore()
    done()
  })
})

describe('The getDomainList function', () => {
  it('should read the domain data and return a list of domains with the provided changes added to it', async done => {
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(
      '{"records":["skullwoodsbush","skullwoodsmiddle","skullwoodsmiddle2",' +
      '"skullwoodsright","skullwoodsright2","skullwoodsleft","skullwoodsleft2",' +
      '"thieveshideout","ganon","ganon2","ganon3","faerie","uncle","batcave",' +
      '"batcave2","treecave","well","well2","sanctuary"],"columns":3,"spacing":0,' +
      '"size":[2,2,1]}'
    )

    const changes = {
      holes: {
        uncle: 'ganon',
        well: 'batcave'
      }
    }
    const result = await CustomiZ3.getDomainList(changes)
    expect(result.holes).toBeInstanceOf(Domain)

    const domainChanges = result.holes.getChanges()
    expect(domainChanges.uncle).toStrictEqual([null, null, 'ganon'])
    expect(domainChanges.well).toStrictEqual([null, null, 'batcave'])
    expect(domainChanges.well2).toStrictEqual([null, null, 'batcave'])
    mockReadFile.mockRestore()
    done()
  })
})

describe('The getPatcher function', () => {
  it('', async done => {
    const mockRom = Buffer.alloc(1024 * 1024)
    mockRom.writeUInt8(0xab, 44 + 899072)
    const mockWriteFile = jest.spyOn(fs, 'writeFile').mockResolvedValue()
    const mockReaddir = jest.spyOn(fs, 'readdir').mockResolvedValue(['1'])
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValueOnce(
      '{"records":["skullwoodsbush","skullwoodsmiddle","skullwoodsmiddle2",' +
      '"skullwoodsright","skullwoodsright2","skullwoodsleft","skullwoodsleft2",' +
      '"thieveshideout","ganon","ganon2","ganon3","faerie","uncle","batcave",' +
      '"batcave2","treecave","well","well2","sanctuary"],"columns":3,"spacing":0,' +
      '"size":[2,2,1]}'
    ).mockResolvedValueOnce(mockRom).mockResolvedValueOnce(
      '{"checksum":{"md5":"8f0c6a4003f70e392ea7e04a40a502e7",' +
      '"address":32732},"offset": {"holes":899072}}'
    ).mockResolvedValueOnce(mockRom)
    const changes = {
      holes: {
        uncle: 'ganon'
      }
    }

    const domainList = await CustomiZ3.getDomainList(changes)
    const romVersion = await CustomiZ3.getRomVersion('')
    const patcherFactory = await CustomiZ3.getPatcher(domainList, romVersion)
    const patcher = await patcherFactory('native')

    expect(patcher).toBeInstanceOf(Patcher)
    await patcher.patch('1', '2')

    const newRom = Buffer.alloc(1024 * 1024)
    newRom.writeUInt8(0xab, 44 + 899072)
    newRom.writeUInt8(0xab, 64 + 899072)
    newRom.writeUInt16LE(0x354, 32732 + 2)
    newRom.writeUInt16LE(~0x354 & 0xffff, 32732)

    expect(mockWriteFile).toHaveBeenCalledWith('2', newRom, { encoding: null })

    mockReadFile.mockRestore()
    mockReaddir.mockRestore()
    mockWriteFile.mockRestore()
    done()
  })
})
