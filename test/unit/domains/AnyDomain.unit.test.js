/* global describe, it, expect, jest, */

const Domain = require('../../../src/domains/Domain')
const HolesDomain = require('../../../src/domains/HolesDomain')
const WhirlpoolsDomain = require('../../../src/domains/WhirlpoolsDomain')
const FlySitesDomain = require('../../../src/domains/FlySitesDomain')
const EntrancesDomain = require('../../../src/domains/EntrancesDomain')

;[EntrancesDomain, HolesDomain, WhirlpoolsDomain, FlySitesDomain].forEach(AnyDomain => {
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
