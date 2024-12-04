/*
  Configuration settings
*/

const config = {
  // These target prices are the last price that the loan was rebalanced at. If
  // the price fluctuates more than 10% away from these targets, then the system
  // will send an email.
  btcTarget: 36650,
  ethTarget: 2022,
  // avaxTarget: 21.31,

  avaxHighTarget: 65.95,
  avaxLowTarget: 43.96,

  // Nostr config
  dmTarget: 'npub188msq9d8tkdnakhlg9j0sn4602773et7ue95u5xeuszf082wx79qq4vz6a',
  relay: 'wss://nostr-relay.psfoundation.info',

  // Nostr priv key for this app
  nostrPrivKey: 'f11de5600c2ee52de9cd77d40c200e191e6449c8bf166400afb2259366abf0bd'
  // public key: 2b28fd5ccaa5218afbf7556c8b539a8bbd15fa2bf07c29c51686f07442c3e8c5
}

// module.exports = config
export default config
