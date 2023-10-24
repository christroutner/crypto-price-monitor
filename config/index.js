/*
  Configuration settings
*/

const config = {
  // These target prices are the last price that the loan was rebalanced at. If
  // the price fluctuates more than 10% away from these targets, then the system
  // will send an email.
  btcTarget: 33791,
  ethTarget: 1666,
  avaxTarget: 10.29
}

module.exports = config
