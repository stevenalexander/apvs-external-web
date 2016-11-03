const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/first-time/eligibility/claim/car-details', function () {
  const ROUTE = `/first-time-claim/eligibility/A123456/claim/1/car`

  var app

  var urlPathValidatorStub
  var expenseUrlRouterStub
  var insertCarExpensesStub
  var getTravellingFromAndToStub
  var carExpenseStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    expenseUrlRouterStub = sinon.stub()
    insertCarExpensesStub = sinon.stub()
    getTravellingFromAndToStub = sinon.stub()
    carExpenseStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/first-time/eligibility/claim/car-details', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/routing/expenses-url-router': expenseUrlRouterStub,
      '../../../../services/data/insert-car-expenses': insertCarExpensesStub,
      '../../../../services/data/get-travelling-from-and-to': getTravellingFromAndToStub,
      '../../../../services/domain/expenses/car-expense': carExpenseStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200', function () {
      getTravellingFromAndToStub.resolves()
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })

    it('should call parseParams', function () {
      getTravellingFromAndToStub.resolves()
      var parseParams = sinon.stub(expenseUrlRouterStub, 'parseParams')
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(parseParams)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const REDIRECT_URL = 'some url'
    const CAR_EXPENSE = {}

    it('should call the URL Path Validator', function () {
      insertCarExpensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      carExpenseStub.returns(CAR_EXPENSE)
      insertCarExpensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(carExpenseStub)
          sinon.assert.calledOnce(insertCarExpensesStub)
          sinon.assert.calledWith(insertCarExpensesStub, CAR_EXPENSE)
        })
        .expect(302)
    })

    it('should call getRedirectUrl and redirect to the url it returns', function () {
      var getRedirectUrl = sinon.stub(expenseUrlRouterStub, 'getRedirectUrl').returns(REDIRECT_URL)
      insertCarExpensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(getRedirectUrl)
        })
        .expect('location', REDIRECT_URL)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      carExpenseStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      carExpenseStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})