/*
  Configuration settings
*/

const config = {
  // These target prices are the last price that the loan was rebalanced at. If
  // the price fluctuates more than 10% away from these targets, then the system
  // will send an email.
  btcTarget: 30172,
  ethTarget: 1950,
  avaxTarget: 13.33
}

module.exports = config
