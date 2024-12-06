/*
  Monitor crypto prices and send an alert via an encrypted private message
  over Nostr to alert when the price moves outside the window set in the
  config file.
*/

// Global npm libraries
import RetryQueue from '@chris.troutner/retry-queue'

// Local libraries
// const NodeMailer = require('./lib/nodemailer.js')
import config from './config/index.js'
import Price from './lib/price.js'
import Nostr from './lib/nostr.js'

// Instantiate libraries
const price = new Price()
const nostr = new Nostr()
const retryQueue = new RetryQueue({
  concurrency: 1,
  attempts: 5,
  retryPeriod: 1000
})

// State
const seenMsgs = []

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

// Do a price check once per hour.
setInterval(function () {
  start()
}, 60000 * 60) // 1 hour

// Check for new DMs every 2 minutes.
setInterval(function() {
  readMsgs()
}, 60000 * 2)

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

    // Calculate the AVAX price targets
    const avaxHighTargetPercent = -1 * calcPercent(avaxPrice, config.avaxHighTarget)
    const avaxLowTargetPercent = calcPercent(avaxPrice, config.avaxLowTarget)
    console.log(`\nAVAX is ${avaxHighTargetPercent}% away from the high target.`)
    console.log(`AVAX is ${avaxLowTargetPercent}% away from the low target.`)

    // Send out alerts if AVAX is near the price targets
    if (avaxHighTargetPercent < 5) {
      const msg = `AVAX price is ${avaxPrice} which is ${avaxHighTargetPercent}% away from the high target of ${config.avaxHighTarget}`
      await retryQueue.addToQueue(nostr.sendMsg, { msg })
    }
    if (avaxLowTargetPercent < 5) {
      const msg = `AVAX price is ${avaxPrice} which is ${avaxLowTargetPercent}% away from the low target of ${config.avaxLowTarget}`
      await retryQueue.addToQueue(nostr.sendMsg, { msg })
    }

    // Calculate the AVAX-ETH price targets
    const ethAvaxPrice = floor2(ethPrice / avaxPrice)
    const ethHighTargetPercent = -1 * calcPercent(ethAvaxPrice, config.ethHighTarget)
    const ethLowTargetPercent = calcPercent(ethAvaxPrice, config.ethLowTarget)
    console.log(`\nethAvaxPrice: ${ethAvaxPrice}, low target: ${config.ethLowTarget}, high target: ${config.ethHighTarget}`)
    console.log(`ETH-AVAX pair is ${ethHighTargetPercent}% away from the high target and ${ethLowTargetPercent}% away from the low target.`)

    // Send out alerts if AVAX-ETH pair is near the price targets
    if (ethHighTargetPercent < 5) {
      const msg = `ETH/AVAX price is ${ethAvaxPrice} which is ${ethHighTargetPercent}% away from the high target of ${config.ethHighTarget}`
      await retryQueue.addToQueue(nostr.sendMsg, { msg })
    }
    if (ethLowTargetPercent < 5) {
      const msg = `ETH/AVAX price is ${ethAvaxPrice} which is ${ethLowTargetPercent}% away from the low target of ${config.ethLowTarget}`
      await retryQueue.addToQueue(nostr.sendMsg, { msg })
    }

    // Calculate the AVAX-BTC price targets
    const btcAvaxPrice = floor2(btcPrice / avaxPrice)
    const btcHighTargetPercent = -1 * calcPercent(btcAvaxPrice, config.btcHighTarget)
    const btcLowTargetPercent = calcPercent(btcAvaxPrice, config.btcLowTarget)
    console.log(`\nbtcAvaxPrice: ${btcAvaxPrice}, low target: ${config.btcLowTarget}, high target: ${config.btcHighTarget}`)
    console.log(`BTC-AVAX pair is ${btcHighTargetPercent}% away from the high target and ${btcLowTargetPercent}% away from the low target.`)

    // Send out alerts if AVAX-ETH pair is near the price targets
    if (btcHighTargetPercent < 5) {
      const msg = `BTC/AVAX price is ${btcAvaxPrice} which is ${btcHighTargetPercent}% away from the high target of ${config.btcHighTarget}`
      await retryQueue.addToQueue(nostr.sendMsg, { msg })
    }
    if (btcLowTargetPercent < 5) {
      const msg = `BTC/AVAX price is ${btcAvaxPrice} which is ${btcLowTargetPercent}% away from the low target of ${config.btcLowTarget}`
      await retryQueue.addToQueue(nostr.sendMsg, { msg })
    }

    console.log('\nFinished.\n')
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
    const ethPrice = await price.getEthPrice()
    const ethAvaxPrice = floor2(ethPrice / avaxPrice)
    const btcPrice = await price.getBtcPrice()
    const btcAvaxPrice = floor2(btcPrice / avaxPrice)

    const msg = `
AVAX Price: ${floor2(avaxPrice)}
High mark: ${config.avaxHighTarget} (${-1 * calcPercent(avaxPrice, config.avaxHighTarget)}%)
Low mark: ${config.avaxLowTarget} (${calcPercent(avaxPrice, config.avaxLowTarget)}%)

ETH/AVAX Price: ${floor2(ethAvaxPrice)}
High mark: ${config.ethHighTarget} (${-1 * calcPercent(ethAvaxPrice, config.ethHighTarget)}%)
Low mark: ${config.ethLowTarget} (${calcPercent(ethAvaxPrice, config.ethLowTarget)}%)


BTC/AVAX Price: ${floor2(btcAvaxPrice)}
High mark: ${config.btcHighTarget} (${-1 * calcPercent(btcAvaxPrice, config.btcHighTarget)}%)
Low mark: ${config.btcLowTarget} (${calcPercent(btcAvaxPrice, config.btcLowTarget)}%)
`
    await retryQueue.addToQueue(nostr.sendMsg, { msg })
  } catch (err) {
    console.error('Error in dailyUpdate(): ', err)
  }
}

const timeToRun = new Date()
timeToRun.setHours(6) // Set the hour to 7 AM
timeToRun.setMinutes(30) // Set the minutes to 0
timeToRun.setSeconds(0) // Set the seconds to 0

runAtSpecificTime(timeToRun, dailyUpdate)

// floor2 - round down to 2 decimal places
// Takes a number and returns it, rounded to the nearest 2 decimal place.
function floor2 (num) {
  const thisNum = Number(num)

  if (isNaN(thisNum)) throw new Error('input must be a number')

  let tempNum = thisNum * 100
  tempNum = Math.floor(tempNum)
  tempNum = tempNum / 100

  return tempNum
}

async function readMsgs() {
  try {
    const result = await nostr.readMsg()

    if(!result) return

    const {msg, id} = result

    if(!seenMsgs.includes(id)) {
      seenMsgs.push(id)

      if(msg.includes('/report')) {
        const now = new Date()
        console.log(`Report command recieved at ${now.toLocaleString()}`)

        dailyUpdate()
      } else {
        console.log('msg: ', msg)
      }
    }
  } catch(err) {
    console.error('Error in readMsgs(): ', err)
  }
}
