/* global describe, it, expect, jest */

const DomainFactory = require('../../../src/domains/DomainFactory')
const Domain = require('../../../src/domains/Domain')
const HolesDomain = require('../../../src/domains/HolesDomain')
const FlySitesDomain = require('../../../src/domains/FlySitesDomain')
const WhirlpoolsDomain = require('../../../src/domains/WhirlpoolsDomain')

const domains = {
  holes: HolesDomain,
  flysites: FlySitesDomain,
  whirlpools: WhirlpoolsDomain
}

describe('The DomainFactory function', () => {
  it('should throw if no valid domain is given.', () => {
    expect(DomainFactory()).rejects.toThrow()
  })
  for (const name in domains) {
    it(`should return a ${domains[name].name} if asked for the domain governing "${name}"`, async done => {
      const mockSuper = jest.spyOn(Domain.prototype, 'init').mockImplementation()
      const instance = await DomainFactory(name)

      expect(instance).toBeInstanceOf(domains[name])
      mockSuper.mockRestore()
      done()
    })
  }
})
