/*
  Monitor an AVAX node for liveness and send an email if it is unresponsive.
*/

// Global npm libraries
const { Avalanche } = require('avalanche')
const axios = require('axios')

// Local libraries
const NodeMailer = require('./lib/nodemailer.js')
const config = require('./config')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

setInterval(function () {
  start()
}, 60000 * 60) // 1 hour

async function start () {
  try {
    const now = new Date()
    console.log(`\nStarting at ${now.toLocaleString()}`)

    // Get the current prices for the assets.
    const btcPrice = await getBtcPrice()
    console.log(`BTC price: ${btcPrice}`)

    const ethPrice = await getEthPrice()
    console.log(`ETH price: ${ethPrice}`)

    const avaxPrice = await getAvaxPrice()
    console.log(`AVAX price: ${avaxPrice}`)

    // Calculate percentages
    const btcPercent = calcPercent(btcPrice, config.btcTarget)
    console.log(`BTC is ${btcPercent}% away from the target.`)
    const ethPercent = calcPercent(ethPrice, config.ethTarget)
    console.log(`ETH is ${ethPercent}% away from the target.`)
    const avaxPercent = calcPercent(avaxPrice, config.avaxTarget)
    console.log(`AVAX is ${avaxPercent}% away from the target.`)

    // Initialize node mailer
    const nodemailer = new NodeMailer()

    // Email me if the price is more than 10% away from target.
    if(btcPercent > 10 || btcPercent < -10) {
      await nodemailer.sendEmail({ message: `BTC is ${btcPercent}% away from the target.` })
    }
    if(ethPercent > 10 || ethPercent < -10) {
      await nodemailer.sendEmail({ message: `ETH is ${ethPercent}% away from the target.` })
    }
    if(avaxPercent > 10 || avaxPercent < -10) {
      await nodemailer.sendEmail({ message: `AVAX is ${avaxPercent}% away from the target.` })
    }

    console.log(`Finished.\n`)
  } catch(err) {
    console.error('Error: ', err)
  }

}
start()

// Calculates the current percentage gain or loss based on the current price
// and target price.
function calcPercent(currentPrice, targetPrice) {
  const diff = currentPrice - targetPrice

  const decimal = diff / targetPrice

  const percent = Math.round(decimal * 1000) / 10

  return percent
}

async function getAvaxPrice() {
  try {
    const host = `https://api.coinex.com/v1`
    const endpoint = `/market/deals?market=AVAXUSDT&limit=1`

    const result = await axios.get(`${host}${endpoint}`)
    // console.log('result.data: ', result.data)

    const avaxPrice = result.data.data[0].price

    return avaxPrice
  } catch(err) {
    console.error('Error in getAvaxPrice()')
    throw err
  }
}

async function getBtcPrice() {
  try {
    const host = `https://api.coinex.com/v1`
    const endpoint = `/market/deals?market=BTCUSDT&limit=1`

    const result = await axios.get(`${host}${endpoint}`)
    // console.log('result.data: ', result.data)

    const btcPrice = result.data.data[0].price

    return btcPrice
  } catch(err) {
    console.error('Error in getBtcPrice()')
    throw err
  }
}

async function getEthPrice() {
  try {
    const host = `https://api.coinex.com/v1`
    const endpoint = `/market/deals?market=ETHUSDT&limit=1`

    const result = await axios.get(`${host}${endpoint}`)
    // console.log('result.data: ', result.data)

    const ethPrice = result.data.data[0].price

    return ethPrice
  } catch(err) {
    console.error('Error in getEthPrice()')
    throw err
  }
}
