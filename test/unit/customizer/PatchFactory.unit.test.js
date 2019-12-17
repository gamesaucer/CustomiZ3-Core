/* global describe, it, expect, jest, beforeEach */

const PatchFactory = require('../../../src/customizer/PatchFactory')
const PatcherFactory = require('../../../src/customizer/patchers/PatcherFactory')
const Patch = require('../../../src/customizer/Patch')
const Domain = require('../../../src/domains/Domain')

const mockVersion = {
  checksum: {
    md5: 'foo',
    address: 0
  },
  offset: {
    testDomain: 42
  }
}

const mockAddChange = jest.fn()
const mockSetVersion = jest.fn()
jest.mock('../../../src/customizer/Patch', () => {
  return jest.fn().mockImplementation(() => {
    return {
      addChange: mockAddChange,
      setVersion: mockSetVersion
    }
  })
})

jest.mock('../../../src/customizer/patchers/PatcherFactory', () => jest.fn(() => {}))
const mockGetChanges = jest.fn(() => ({ change: [null, 'this'], literal: [48, null] }))
jest.mock('../../../src/domains/Domain', () => {
  return jest.fn().mockImplementation(() => {
    return {
      ifInitialised: function (cb) { return cb() },
      addChanges: function () {},
      getChanges: mockGetChanges,
      getDataFormat: function () {
        return {
          records: [
            'change',
            'this',
            'literal'
          ],
          columns: 2,
          spacing: [69],
          size: [1, 1]
        }
      }
    }
  })
})

beforeEach(() => jest.clearAllMocks())

describe('The PatchFactory method', () => {
  it('should return a PatcherFactory function.', async done => {
    await expect(PatchFactory({ testDomain: new Domain() }, mockVersion))
      .resolves
      .toStrictEqual(PatcherFactory.mock.instances[0])
    done()
  })
  it('should create a Patch with the calculated changes.', async done => {
    await PatchFactory({ testDomain: new Domain() }, mockVersion)

    expect(mockSetVersion).toHaveBeenCalledWith(mockVersion)
    expect(mockAddChange).toHaveBeenCalledWith(114, 115)
    expect(mockAddChange).toHaveBeenCalledWith(44, '30')
    done()
  })
  it('should provide the PatcherFactory with the Patch.', async done => {
    await PatchFactory({ testDomain: new Domain() }, mockVersion)

    expect(PatcherFactory).toHaveBeenCalledWith(new Patch(), null)
    done()
  })
  it('should read non-number literals as bytes.', async done => {
    mockGetChanges.mockImplementation(() => { return { literal: ['0', null] } })
    await PatchFactory({ testDomain: new Domain() }, mockVersion)

    expect(mockAddChange).toHaveBeenCalledWith(44, '30')
    done()
  })
  it('should throw away excess bytes in a literal.', async done => {
    mockGetChanges.mockImplementation(() => { return { literal: [99999, null] } })
    await PatchFactory({ testDomain: new Domain() }, mockVersion)

    expect(mockAddChange).toHaveBeenCalledWith(44, '9f')
    done()
  })
})
