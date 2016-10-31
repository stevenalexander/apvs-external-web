const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const express = require('express')
const expect = require('chai').expect
const mockViewEngine = require('../../../mock-view-engine')
const bodyParser = require('body-parser')
require('sinon-bluebird')

var reference = 'V123456'
var claimId = '1'

describe('routes/first-time/eligibility/claim/claim-summary', function () {
  var request
  var urlValidatorCalled
  var getIndividualClaimDetails

  beforeEach(function () {
    getIndividualClaimDetails = sinon.stub().resolves()

    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/claim-summary', {
        '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true },
        '../../../../services/data/get-individual-claim-details': getIndividualClaimDetails
      })

    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe('GET /first-time-claim/eligibility/:reference/claim/:claimId/summary', function () {
    it('should respond with a 200', function (done) {
      request
        .get(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary`)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(getIndividualClaimDetails.calledWith(claimId)).to.be.true
          done()
        })
    })
  })

  describe('POST /first-time-claim/eligibility/:reference/claim/:claimId/summary', function () {
    it('should respond with a 302', function (done) {
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(response.headers['location']).to.be.equal(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
          done()
        })
    })
  })
})