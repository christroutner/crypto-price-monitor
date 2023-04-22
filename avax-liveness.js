/*
  Monitor an AVAX node for liveness and send an email if it is unresponsive.
*/

// Global npm libraries
const { Avalanche } = require('avalanche')

// Local libraries
const NodeMailer = require('./lib/nodemailer.js')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

setInterval(function () {
  start()
}, 60000 * 60) // 1 hour

async function start () {
  try {
    // console.log('Avalanche: ', Avalanche)
    const avalanche = new Avalanche('avax.fullstackslp.nl', 9650, 'http', 1)
    // console.log('avalanche: ', avalanche)

    const info = avalanche.apis.info
    // console.log('info: ', info)

    const nodeId = await info.getNodeID()

    const now = new Date()

    console.log(`Success. Node ID: ${nodeId}, time: ${now.toLocaleString()}`)
  } catch (err) {
    console.error(err)

    const nodemailer = new NodeMailer()
    await nodemailer.sendEmail({ message: err.message })
  }
}
start()
