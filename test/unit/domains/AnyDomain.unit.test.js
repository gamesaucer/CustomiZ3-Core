/* global describe, it, expect, jest, */

import Domain from '../../../src/domains/Domain'
import HolesDomain from '../../../src/domains/HolesDomain'
import WhirlpoolsDomain from '../../../src/domains/WhirlpoolsDomain'
import FlySitesDomain from '../../../src/domains/FlysitesDomain'

[HolesDomain, WhirlpoolsDomain, FlySitesDomain].forEach(AnyDomain => {
  describe(`The ${AnyDomain.name} class`, () => {
    it('should allow instantiation', () => {
      const domain = new AnyDomain()
      expect(domain).toBeTruthy()
    })
    it('should extend Domain', () => {
      expect(Object.getPrototypeOf(AnyDomain)).toStrictEqual(Domain)
    })
  })
  describe('The init method', () => {
    it('should call its super method', async done => {
      const mockSuper = jest.spyOn(Domain.prototype, 'init')
      const domain = new AnyDomain()

      await domain.init()
      expect(mockSuper).toHaveBeenCalled()
      mockSuper.mockRestore()
      done()
    })
  })
})
