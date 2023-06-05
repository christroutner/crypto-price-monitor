/*
  Configuration settings
*/

const config = {
  // These target prices are the last price that the loan was rebalanced at. If
  // the price fluctuates more than 10% away from these targets, then the system
  // will send an email.
  btcTarget: 25663,
  ethTarget: 1920,
  avaxTarget: 13.88
}

module.exports = config
