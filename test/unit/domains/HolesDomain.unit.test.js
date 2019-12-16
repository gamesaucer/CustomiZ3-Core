/* global describe, it, expect, jest */

import HolesDomain from '../../../src/domains/HolesDomain'
import Domain from '../../../src/domains/Domain'
import { promises as fs } from 'fs'

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

describe('The HolesDomain class', () => {
  it('should allow instantiation', () => {
    expect(new HolesDomain()).toBeTruthy()
  })
  it('should extend Domain', () => {
    expect(Object.getPrototypeOf(HolesDomain)).toStrictEqual(Domain)
  })
})

describe('The getChanges method', () => {
  it('should apply each change only to the third column.', async done => {
    const domain = new HolesDomain()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)
    await domain.init()

    domain.addChanges({ foo: 'bar' })
    expect(domain.getChanges().foo).toStrictEqual([null, null, 'bar'])
    mockReadFile.mockRestore()
    done()
  })

  it('should apply each change to all elements that are the name of the provided ones plus a number', async done => {
    const domain = new HolesDomain()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)
    await domain.init()

    domain.addChanges({ foo: 'bar' })
    const changes = domain.getChanges()

    expect(changes.foo2).toStrictEqual(changes.foo)
    mockReadFile.mockRestore()
    done()
  })

  it('should skip adding changes for elements that are the name of another plus a number if that base element has not been changed', async done => {
    const domain = new HolesDomain()
    const mockReadFile = jest.spyOn(fs, 'readFile').mockResolvedValue(mockFormat)
    await domain.init()

    domain.addChanges({ bar: 'baz' })
    const changes = domain.getChanges()

    expect(changes.foo2).not.toBeDefined()
    mockReadFile.mockRestore()
    done()
  })
})
