const validator = require('validator')
const FIELD_NAMES = require('./validation-field-names')
const ERROR_MESSAGES = require('./validation-error-messages')

// TODO: Incorporate ErrorHandler replacing exisitng error specific logic in this class.
// TODO: Add unit test for this clas.

// ES6 Class used to chain common validation calls together
// Using ES6 Template literals
class FieldValidator {
  constructor (data, fieldName, errors) {
    this.data = data
    this.fieldName = fieldName
    this.displayName = FIELD_NAMES[fieldName]
    this.errors = errors

    this.errors[fieldName] = []
  }

  isRequired (questionType = 'field') {
    if (!this.data) {
      if (questionType === 'radio') {
        this.addErrorMessage(ERROR_MESSAGES.getRadioQuestionIsRequired)
      } else if (questionType === 'journeyAssistance') {
        this.addErrorMessage(ERROR_MESSAGES.getJourneyAssistanceIsRequired)
      } else {
        this.addErrorMessage(ERROR_MESSAGES.getIsRequired)
      }
    }
    return this
  }

  isAlpha () {
    if (!validator.isAlpha(this.data)) {
      this.addErrorMessage(ERROR_MESSAGES.getIsAlpha)
    }
    return this
  }

  isNumeric () {
    if (!validator.isNumeric(this.data)) {
      this.addErrorMessage(ERROR_MESSAGES.getIsNumeric)
    }
    return this
  }

  isLength (length) {
    if (!validator.isLength(this.data, {min: length, max: length})) {
      this.addErrorMessage(ERROR_MESSAGES.getIsLengthMessage, { length: length })
    }
    return this
  }

  addErrorMessage (message, options) {
    this.errors[this.fieldName].push(message(this.displayName, options))
  }
}

exports.default = function (data, fieldName, errors) {
  return new FieldValidator(data, fieldName, errors)
}

module.exports = exports['default']