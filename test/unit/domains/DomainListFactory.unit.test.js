/* global describe, it, expect, jest, beforeEach */

import DomainListFactory from '../../../src/domains/DomainListFactory'
import DomainFactory from '../../../src/domains/DomainFactory'

const mockAddChanges = jest.fn()
jest.mock('../../../src/domains/DomainFactory', () => {
  return jest.fn().mockImplementation(() => {
    return {
      addChanges: mockAddChanges
    }
  })
})
beforeEach(() => jest.clearAllMocks())

describe('The DomainListFactory function', () => {
  it('should use the DomainFactory function to create Domains', async done => {
    await DomainListFactory({
      testDomain: 'testChange'
    })
    expect(DomainFactory).toHaveBeenCalledWith('testDomain')
    done()
  })
  it('should add the provided changes to each Domain', async done => {
    await DomainListFactory({
      testDomain: 'testChange'
    })
    expect(mockAddChanges).toHaveBeenCalledWith('testChange')
    done()
  })
  it('should return a Domain', async done => {
    const domains = await DomainListFactory({
      testDomain: 'testChange'
    })
    expect(domains.testDomain).toStrictEqual(DomainFactory())
    done()
  })
})
