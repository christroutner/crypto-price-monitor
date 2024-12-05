/*
  Adapter library for interacting with Nostr.
*/

// Global npm libraries
// import * as nip19 from 'nostr-tools/nip19'
import { nip19, nip04 } from 'nostr-tools'
import { hexToBytes } from '@noble/hashes/utils'
import { finalizeEvent } from 'nostr-tools/pure'
import { Relay, useWebSocketImplementation } from 'nostr-tools/relay'
import WebSocket from 'ws'

// Local libraries
import config from '../config/index.js'
useWebSocketImplementation(WebSocket)

class NostrAdapter {
  constructor() {
    // Bind 'this' object to all subfunctions
    this.npub2pubKey = this.npub2pubKey.bind(this)
    this.sendMsg = this.sendMsg.bind(this)
  }

  // Given an npub, convert it to a public key.
  // Output is a string in hex.
  npub2pubKey () {
    const npub = config.dmTarget

    const { data } = nip19.decode(npub)
    // console.log()
    return data
  }

  // Send an E2EE message to a Nostr user.
  async sendMsg (inObj = {}) {
    try {
      const { msg } = inObj
      console.log(`sending this message: ${msg}`)

      // const pubkey = hexToBytes(this.npub2pubKey())
      const pubkey = this.npub2pubKey()
      const relayConfig = config.relay
      const now = new Date()
      const appPrivKey = config.nostrPrivKey
      const clrMsg = `${msg}\nTimestamp: ${now.toLocaleString()}`

      const appPrivKeyBin = hexToBytes(appPrivKey)
      // const appPubKey = getPublicKey(appPrivKeyBin)

      const encryptedMsg = await nip04.encrypt(appPrivKeyBin, pubkey, clrMsg)

      const eventTemplate = {
        kind: 4,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', pubkey]],
        content: encryptedMsg
      }

      // Sign the post
      const signedEvent = finalizeEvent(eventTemplate, appPrivKeyBin)

      // Connect to a relay.
      const relay = await Relay.connect(relayConfig)
      console.log(`connected to ${relay.url}`)

      // Publish the message to the relay.
      await relay.publish(signedEvent)

      // Close the connection to the relay.
      relay.close()
    } catch (err) {
      console.error('Error in sendMsg()')
      throw new Error(err.message)
    }
  }
}

export default NostrAdapter
