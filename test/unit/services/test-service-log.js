var expect = require('chai').expect
var log = require('../../../app/services/log')

describe('log service', function () {
  describe('create logger', function () {
    it('should create a log called external web', function () {
      expect(log.fields.name).to.equal('external-web')
    })
  })
})