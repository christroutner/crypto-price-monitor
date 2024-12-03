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

    // AVAX Price
    if (avaxPrice > config.avaxHighTarget) {
      const msg = `AVAX price is ${avaxPrice} which is above the high-water target of ${config.avaxHighTarget}`
      await nostr.sendMsg({ msg })
    }

    // Calculate percentages
    // const btcPercent = calcPercent(btcPrice, config.btcTarget)
    // console.log(`BTC is ${btcPercent}% away from the target.`)
    // const ethPercent = calcPercent(ethPrice, config.ethTarget)
    // console.log(`ETH is ${ethPercent}% away from the target.`)
    // const avaxPercent = calcPercent(avaxPrice, config.avaxTarget)
    // console.log(`AVAX is ${avaxPercent}% away from the target.`)

    // Initialize node mailer
    // const nodemailer = new NodeMailer()
    //
    // // Email me if the price is more than 10% away from target.
    // if(btcPercent > 10 || btcPercent < -10) {
    //   await nodemailer.sendEmail({ message: `BTC is ${btcPercent}% away from the target.` })
    // }
    // if(ethPercent > 10 || ethPercent < -10) {
    //   await nodemailer.sendEmail({ message: `ETH is ${ethPercent}% away from the target.` })
    // }
    // if(avaxPercent > 10 || avaxPercent < -10) {
    //   await nodemailer.sendEmail({ message: `AVAX is ${avaxPercent}% away from the target.` })
    // }

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
