const expect = require('chai').expect
const forEdit = require('../../../../app/routes/helpers/for-edit')

const VALID_STATUS = 'PENDING'
const STATUS2 = 'APPROVED'
const ISADVANCE = true
const INVALID_STATUS = 'REJECTED'

describe('routes/helpers/for-edit', function () {
  it('should return true for valid status non advance claim', function () {
    expect(forEdit(VALID_STATUS, false)).to.be.true
  })

  it('should return true for approved status when advance claim is true', function () {
    expect(forEdit(STATUS2, ISADVANCE)).to.be.true
  })

  it('should return false for approved status when advance claim is false', function () {
    expect(forEdit(STATUS2, false)).to.be.false
  })

  it('should return false for invalid status', function () {
    expect(forEdit(INVALID_STATUS, false)).to.be.false
  })
})
