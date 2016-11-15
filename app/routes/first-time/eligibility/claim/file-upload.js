const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const DocumentTypeEnum = require('../../../../constants/document-type-enum')
const DirectoryCheck = require('../../../../services/directory-check')
const Upload = require('../../../../services/upload')
const ValidationError = require('../../../../services/errors/validation-error')
const ERROR_MESSAGES = require('../../../../services/validators/validation-error-messages')
const FileUpload = require('../../../../services/domain/file-upload')
const ClaimDocumentInsert = require('../../../../services/data/insert-file-upload-details-for-claim')
const csrfProtection = require('csurf')({ cookie: true })
const generateCSRFToken = require('../../../../services/generate-csrf-token')
var csrfToken

module.exports = function (router) {
  router.get('/first-time/eligibility/:referenceId/claim/:claimId/file-upload', function (req, res) {
    csrfToken = generateCSRFToken(req)
    UrlPathValidator(req.params)

    if (DocumentTypeEnum.hasOwnProperty(req.query.document)) {
      DirectoryCheck(req.params.referenceId, req.params.claimId, req.query.claimExpenseId, req.query.document)
      res.render('first-time/eligibility/claim/file-upload', {
        document: req.query.document,
        fileUploadGuidingText: DocumentTypeEnum,
        URL: req.url
      })
    } else {
      throw new Error('Not a valid document type')
    }
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/file-upload', function (req, res, next) {
    UrlPathValidator(req.params)
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)

    Upload(req, res, function (error) {
      try {
        // If there was no file attached, we still need to check the CSRF token
        if (!req.file) {
          csrfProtection(req, res, function (error) {
            if (error) { throw error }
          })
        }
        if (error) {
          throw new ValidationError({upload: [ERROR_MESSAGES.getUploadTooLarge]})
        } else {
          if (DocumentTypeEnum.hasOwnProperty(req.query.document)) {
            var fileUpload = new FileUpload(req.params.claimId, req.query.document, req.query.claimExpenseId, req.file, req.error, req.body.alternative)

            ClaimDocumentInsert(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.params.claimId, fileUpload).then(function () {
              res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`)
            }).catch(function (error) {
              next(error)
            })
          } else {
            throw new Error('Not a valid document type')
          }
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          return res.status(400).render('first-time/eligibility/claim/file-upload', {
            document: req.query.document,
            fileUploadGuidingText: DocumentTypeEnum,
            errors: error.validationErrors,
            URL: req.url,
            csrfToken: csrfToken
          })
        } else {
          next(error)
        }
      }
    })
  })
}
