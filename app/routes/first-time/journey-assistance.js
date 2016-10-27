const journeyAssistanceValidator = require('../../services/validators/eligibility/journey-assistance-validator')
const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/journey-assistance', {
      dob: req.params.dob,
      relationship: req.params.relationship
    })
  })

  router.post('/first-time/:dob/:relationship', function (req, res) {
    UrlPathValidator(req.params)

    var assistance = req.body['assistance']
    var dob = req.params.dob
    var relationship = req.params.relationship

    var validationErrors = journeyAssistanceValidator(req.body)

    if (validationErrors) {
      return res.status(400).render('first-time/journey-assistance', {
        errors: validationErrors,
        dob: dob,
        relationship: relationship
      })
    }
    return res.redirect(`/first-time/${dob}/${relationship}/${assistance}`)
  })
}