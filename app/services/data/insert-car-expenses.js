const insertExpense = require('../../services/data/insert-expense')

module.exports = function (carExpense, tollExpense, parkingExpense) {
  return insert(carExpense)
    .then(function () {
      return insert(carExpense.tollExpense)
    })
    .then(function () {
      return insert(carExpense.parkingExpense)
    })
}

function insert (expense) {
  if (expense) {
    return insertExpense(expense)
  }
}