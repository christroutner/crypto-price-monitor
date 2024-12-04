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

// Run a function at a specific time.
function runAtSpecificTime (time, callback) {
  const now = new Date()
  const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.getHours(), time.getMinutes(), time.getSeconds())

  if (targetTime < now) {
    targetTime.setDate(targetTime.getDate() + 1) // Schedule for the next day if the target time has already passed
  }

  const delay = targetTime.getTime() - now.getTime()

  setTimeout(() => {
    callback()
    setInterval(callback, 86400000) // 24 hours in milliseconds
  }, delay)
}

// Send a daily update on the prices of different assets.
async function dailyUpdate () {
  try {
    const avaxPrice = await price.getAvaxPrice()
    console.log(`AVAX price: ${avaxPrice}`)

    const msg = `
AVAX Price: ${avaxPrice}
High mark: ${config.avaxHighTarget} (${calcPercent(avaxPrice, config.avaxHighTarget)}%)
Low mark: ${config.avaxLowTarget} (${calcPercent(avaxPrice, config.avaxLowTarget)}%)

`
    await nostr.sendMsg({ msg })
  } catch (err) {
    console.error('Error in dailyUpdate(): ', err)
  }
}

const timeToRun = new Date()
timeToRun.setHours(6) // Set the hour to 7 AM
timeToRun.setMinutes(30) // Set the minutes to 0
timeToRun.setSeconds(0) // Set the seconds to 0

runAtSpecificTime(timeToRun, dailyUpdate)
