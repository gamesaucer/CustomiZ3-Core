/* global describe, it, expect, jest */

const fs = require('fs').promises
const EntrancesDomain = require('../../../src/domains/EntrancesDomain')
const Domain = require('../../../src/domains/Domain')

const mockFormat = JSON.stringify({
  records: [
    'foo',
    'foo2',
    'bar'
  ],
  columns: 3,
  spacing: 0,
  size: [2, 2, 1]
})

describe('The EntrancesDomain class', () => {
  it('should allow instantiation', () => {
    expect(new EntrancesDomain()).toBeTruthy()
  })
  it('should extend Domain', () => {
    expect(Object.getPrototypeOf(EntrancesDomain)).toStrictEqual(Domain)
  })
})

describe('The getChanges method', () => {
  it('should apply each change only to the third column.', async done => {
    const domain = new EntrancesDomain()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)
    await domain.init()

    domain.addChanges({ foo: 'bar' })
    expect(domain.getChanges().foo).toStrictEqual([null, null, 'bar'])
    mockReadFile.mockRestore()
    done()
  })
})
