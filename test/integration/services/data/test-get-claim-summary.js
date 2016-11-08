const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')

const getClaimSummary = require('../../../../app/services/data/get-claim-summary')

var reference = 'V123456'
var claimId

describe('services/data/get-claim-summary', function () {
  before(function () {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(reference)
      .then(function () {
        return claimHelper.insert(reference).then(function (newClaimId) {
          claimId = newClaimId
          return expenseHelper.insert(claimId)
        })
      })
  })

  it('should return summary of claim details', function () {
    return getClaimSummary(claimId)
      .then(function (result) {
        expect(result.claim.Reference).to.equal(reference)
        expect(result.claim.DateOfJourney).to.be.within(
          claimHelper.DATE_OF_JOURNEY.subtract(1, 'seconds').toDate(),
          claimHelper.DATE_OF_JOURNEY.add(1, 'seconds').toDate()
        )
        expect(result.claimExpenses[0].ExpenseType).to.equal(expenseHelper.EXPENSE_TYPE)
        expect(result.claimExpenses[0].Cost).to.equal(Number(expenseHelper.COST).toFixed(2))
      })
  })

  after(function () {
    return expenseHelper.delete(claimId)
      .then(function () {
        return claimHelper.delete(claimId)
      })
      .then(function () {
        return eligiblityHelper.deleteEligibilityVisitorAndPrisoner(reference)
      })
  })
})
