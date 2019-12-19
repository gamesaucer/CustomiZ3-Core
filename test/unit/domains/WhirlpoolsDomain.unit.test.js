/* global describe, it, expect, jest */

const fs = require('fs').promises
const WhirlpoolsDomain = require('../../../src/domains/WhirlpoolsDomain')
const Domain = require('../../../src/domains/Domain')

const mockFormat = JSON.stringify({
  records: [
    'foo',
    'bar',
    'hello',
    'world'
  ],
  columns: 1,
  spacing: 0,
  size: [2, 2, 3]
})

describe('The HolesDomain class', () => {
  it('should allow instantiation', () => {
    expect(new WhirlpoolsDomain()).toBeTruthy()
  })
  it('should extend Domain', () => {
    expect(Object.getPrototypeOf(WhirlpoolsDomain)).toStrictEqual(Domain)
  })
})

describe('The getChanges method', () => {
  it('should swap names for whirlpool target locations with the name of the whirlpool that leads there.', async done => {
    const domain = new WhirlpoolsDomain()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)
    await domain.init()

    domain.addChanges({ foo: ['hello', 'bar', 'baz'] })
    const changes = domain.getChanges()

    expect(changes.foo).toStrictEqual(['world', 'foo', 'baz'])
    mockReadFile.mockRestore()
    done()
  })
})
