const UrlPathValidator = require('../services/validators/url-path-validator')
const decrypt = require('../services/helpers/decrypt')

module.exports = function (router) {
  router.get('/application-updated/:reference', function (req, res) {
    UrlPathValidator(req.params)

    var decryptedRef = decrypt(req.params.reference)
    return res.render('application-updated', {
      reference: decryptedRef
    })
  })
}
