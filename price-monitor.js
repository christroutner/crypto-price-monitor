/*
  Monitor crypto prices and send an alert via an encrypted private message
  over Nostr to alert when the price moves outside the window set in the
  config file.
*/

// Global npm libraries
// const { Avalanche } = require('avalanche')
// const axios = require('axios')

// Local libraries
// const NodeMailer = require('./lib/nodemailer.js')
import config from './config/index.js'
import Price from './lib/price.js'
import Nostr from './lib/nostr.js'

const price = new Price()
const nostr = new Nostr()

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

setInterval(function () {
  start()
}, 60000 * 60) // 1 hour

async function start () {
  try {
    const now = new Date()
    console.log(`\nStarting at ${now.toLocaleString()}`)

    // Get the current prices for the assets.
    const btcPrice = await price.getBtcPrice()
    console.log(`BTC price: ${btcPrice}`)

    const ethPrice = await price.getEthPrice()
    console.log(`ETH price: ${ethPrice}`)

    const avaxPrice = await price.getAvaxPrice()
    console.log(`AVAX price: ${avaxPrice}`)

    // AVAX Price Targets
    if (avaxPrice > config.avaxHighTarget) {
      const msg = `AVAX price is ${avaxPrice} which is above the high-water target of ${config.avaxHighTarget}`
      await nostr.sendMsg({ msg })
    }

    console.log('Finished.\n')
  } catch (err) {
    console.error('Error: ', err)
  }
}
start()

// Calculates the current percentage gain or loss based on the current price
// and target price.
function calcPercent (currentPrice, targetPrice) {
  const diff = currentPrice - targetPrice

  const decimal = diff / targetPrice

  const percent = Math.round(decimal * 1000) / 10

  return percent
}
