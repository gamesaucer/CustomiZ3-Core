/* global describe, it, expect, jest */

import DomainFactory from '../../../src/domains/DomainFactory'
import Domain from '../../../src/domains/Domain'
import HolesDomain from '../../../src/domains/HolesDomain'

const domains = {
  holes: HolesDomain
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
