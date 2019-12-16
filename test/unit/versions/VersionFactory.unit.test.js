/* global describe, it, expect, jest, */

import VersionFactory from '../../../src/versions/VersionFactory'
import { promises as fs } from 'fs'
import crypto from 'crypto'

const mockVersion = {
  checksum: {
    md5: 'foo'
  }
}

const mockVersion2 = {
  checksum: {
    md5: 'bar'
  }
}

describe('The VersionFactory method', () => {
  it('should return the contents of the first version file matching the given rom it finds.', async done => {
    const mockGetVersionList = jest.spyOn(VersionFactory, 'getVersionList').mockResolvedValue(['version1', 'version2'])
    const mockGetFileChecksum = jest.spyOn(VersionFactory, 'getFileChecksum').mockResolvedValue('foo')
    const mockGetVersion = jest.spyOn(VersionFactory, 'getVersion')
      .mockResolvedValue(mockVersion)
      .mockResolvedValueOnce(mockVersion2)

    await expect(VersionFactory()).resolves.toStrictEqual(mockVersion)

    mockGetVersionList.mockRestore()
    mockGetFileChecksum.mockRestore()
    mockGetVersion.mockRestore()
    done()
  })
  it('should throw if no versions match the rom checksum.', async done => {
    const mockGetVersionList = jest.spyOn(VersionFactory, 'getVersionList').mockResolvedValue(['version1', 'version2'])
    const mockGetFileChecksum = jest.spyOn(VersionFactory, 'getFileChecksum').mockResolvedValue('bar')
    const mockGetVersion = jest.spyOn(VersionFactory, 'getVersion').mockResolvedValue(mockVersion)

    await expect(VersionFactory()).rejects.toThrow()

    mockGetVersionList.mockRestore()
    mockGetFileChecksum.mockRestore()
    mockGetVersion.mockRestore()
    done()
  })
})

describe('The getVersionList method', () => {
  it('should throw if reading the directory fails.', async done => {
    const mockReaddir = jest.spyOn(fs, 'readdir').mockRejectedValue(new Error())

    await expect(VersionFactory.getVersionList()).rejects.toThrow()
    mockReaddir.mockRestore()
    done()
  })
  it('should return a list of versions.', async done => {
    const mockResult = ['testVersion']
    const mockReaddir = jest.spyOn(fs, 'readdir').mockResolvedValue(mockResult)

    await expect(VersionFactory.getVersionList()).resolves.toStrictEqual(mockResult)
    mockReaddir.mockRestore()
    done()
  })
})

describe('The getVersion method', () => {
  it('should throw if reading a version file fails.', async done => {
    const mockReadFile = jest.spyOn(fs, 'readFile').mockRejectedValue(new Error())

    await expect(VersionFactory.getVersion()).rejects.toThrow()
    mockReadFile.mockRestore()
    done()
  })
  it('should return the version data.', async done => {
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockVersion))

    await expect(VersionFactory.getVersion()).resolves.toStrictEqual(mockVersion)
    mockReadFile.mockRestore()
    done()
  })
})

describe('The getFileChecksum method', () => {
  it('should throw if reading the file fails.', async done => {
    const mockReadFile = jest.spyOn(fs, 'readFile').mockRejectedValue(new Error())

    await expect(VersionFactory.getFileChecksum()).rejects.toThrow()
    mockReadFile.mockRestore()
    done()
  })
  it('should return the file\'s md5 checksum.', async done => {
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockVersion))
    const hash = crypto.createHash('md5').update(JSON.stringify(mockVersion)).digest('hex')

    await expect(VersionFactory.getFileChecksum()).resolves.toBe(hash)
    mockReadFile.mockRestore()
    done()
  })
})
