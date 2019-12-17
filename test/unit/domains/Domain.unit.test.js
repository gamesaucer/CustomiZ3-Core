/* global describe, it, expect, jest, */

const fs = require('fs').promises
const Domain = require('../../../src/domains/Domain')

class TestDomain extends Domain {}

const mockFormat = JSON.stringify({
  records: [
    'foo',
    'foo2',
    'bar'
  ],
  columns: 3,
  spacing: 0,
  size: 2
})

describe('The Domain class', () => {
  it('should not allow instantiation', () => {
    expect(() => new Domain()).toThrow()
  })
})
describe('The init method', () => {
  it('should read from provided JSON file into the dataFormat property', async done => {
    const examplePath = 'examplePath'
    const domain = new TestDomain()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)
    const expectedFormat = {
      records: ['foo', 'foo2', 'bar'],
      columns: 3,
      spacing: [0, 0],
      size: [2, 2, 2]
    }

    await domain.init(examplePath)
    expect(mockReadFile).toHaveBeenCalledWith(examplePath, 'utf-8')
    expect(domain.dataFormat).toStrictEqual(expectedFormat)
    mockReadFile.mockRestore()
    done()
  })
  it('should throw an error if reading fails', () => {
    const domain = new TestDomain()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockRejectedValue(new Error())

    expect(domain.init('example')).rejects.toThrow()
    mockReadFile.mockRestore()
  })
})
describe('The ifInitialised method', () => {
  it('should call back if the Domain is initialised', async done => {
    const mockCallback = jest.fn()
    const domain = new TestDomain()

    domain.dataFormat = { foo: 'bar' }
    domain.ifInitialised(mockCallback)
    expect(domain.ifInitialised(() => mockCallback)).toStrictEqual(mockCallback)
    expect(mockCallback).toHaveBeenCalled()
    done()
  })
  it('should throw if the Domain is uninitialised', () => {
    const domain = new TestDomain()
    expect(() => domain.ifInitialised()).toThrow()
  })
})
describe('The getDataFormat method', () => {
  it('should return the data format it has been given', () => {
    const domain = new TestDomain()
    const exampleFormat = { foo: 'bar' }

    domain.dataFormat = exampleFormat
    expect(domain.getDataFormat()).toStrictEqual(exampleFormat)
  })
  it('should call the ifInitialised method', () => {
    const mockIfInitialised = jest.spyOn(Domain.prototype, 'ifInitialised').mockImplementation()
    const domain = new TestDomain()

    domain.getDataFormat()
    expect(mockIfInitialised).toHaveBeenCalled()
    mockIfInitialised.mockRestore()
  })
})
describe('The addChanges method', () => {
  it('should store the provided changes', async done => {
    const domain = new TestDomain()
    const changes = { foo: 'bar' }
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)

    await domain.init()
    domain.addChanges(changes)
    expect(domain.changes).toStrictEqual(changes)
    mockReadFile.mockRestore()
    done()
  })
  it('should override previous changes with provided changes where they overlap', async done => {
    const domain = new TestDomain()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)

    await domain.init()
    domain.addChanges({ foo: [1, 1, 1] })
    domain.addChanges({ foo: [2, 2, 2] })
    expect(domain.changes.foo).toStrictEqual([2, 2, 2])
    mockReadFile.mockRestore()
    done()
  })
  it('should leave previous changes alone where they don\'t overlap with provided changes', async done => {
    const domain = new TestDomain()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)

    await domain.init()
    domain.addChanges({ foo: [1, 1, 1] })
    domain.addChanges({ bar: [2, 2, 2] })
    expect(domain.changes.foo).toStrictEqual([1, 1, 1])
    mockReadFile.mockRestore()
    done()
  })
})
describe('The getChanges method', () => {
  it('should return the provided changes', async done => {
    const domain = new TestDomain()
    const changes = { foo: 'bar' }
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)

    await domain.init()
    domain.addChanges(changes)
    expect(domain.getChanges()).toStrictEqual(changes)
    mockReadFile.mockRestore()
    done()
  })
})
describe('The fixFormat method', () => {
  it('should infer the format\'s left out array entries', () => {
    const domain = new TestDomain()
    domain.dataFormat = JSON.parse(mockFormat)

    domain.fixFormat()
    expect(domain.getDataFormat().spacing).toStrictEqual([0, 0])
    expect(domain.getDataFormat().size).toStrictEqual([2, 2, 2])
  })
  it('should ignore entries that are already expanded properly', () => {
    const domain = new TestDomain()
    domain.dataFormat = {
      records: ['foo', 'foo2', 'bar'],
      columns: 3,
      spacing: [0, 0],
      size: [2, 2, 2]
    }

    domain.fixFormat()
    expect(domain.getDataFormat().spacing).toStrictEqual([0, 0])
    expect(domain.getDataFormat().size).toStrictEqual([2, 2, 2])
  })
})
