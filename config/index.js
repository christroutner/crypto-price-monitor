/*
  Configuration settings
*/

const config = {

  // Nostr config
  dmTarget: 'npub188msq9d8tkdnakhlg9j0sn4602773et7ue95u5xeuszf082wx79qq4vz6a',
  relay: 'wss://nostr-relay.psfoundation.info',

  // Nostr keys for this app
  nostrPrivKey: 'f11de5600c2ee52de9cd77d40c200e191e6449c8bf166400afb2259366abf0bd',
  nostrPubKey: '2b28fd5ccaa5218afbf7556c8b539a8bbd15fa2bf07c29c51686f07442c3e8c5',

  // Targets for AVAX-Stablecoin pair
  avaxHighTarget: 52.8,
  avaxLowTarget: 35.2,

  // Targets for AVAX-ETH pair
  ethHighTarget: 104.16,
  ethLowTarget: 69.44,

  // Targets for AVAX-BTC pair
  btcHighTarget: 3000,
  btcLowTarget: 2000
}

// module.exports = config
export default config
