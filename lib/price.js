/*
  This adapter library is responsible for retrieving price data.
*/

// Global npm libraries
import axios from 'axios'

class Price {
  async getAvaxPrice () {
    try {
      const host = 'https://api.coinex.com/v1'
      const endpoint = '/market/deals?market=AVAXUSDT&limit=1'

      const result = await axios.get(`${host}${endpoint}`)
      // console.log('result.data: ', result.data)

      const avaxPrice = result.data.data[0].price

      return avaxPrice
    } catch (err) {
      console.error('Error in getAvaxPrice()')
      throw err
    }
  }

  async getBtcPrice () {
    try {
      const host = 'https://api.coinex.com/v1'
      const endpoint = '/market/deals?market=BTCUSDT&limit=1'

      const result = await axios.get(`${host}${endpoint}`)
      // console.log('result.data: ', result.data)

      const btcPrice = result.data.data[0].price

      return btcPrice
    } catch (err) {
      console.error('Error in getBtcPrice()')
      throw err
    }
  }

  async getEthPrice () {
    try {
      const host = 'https://api.coinex.com/v1'
      const endpoint = '/market/deals?market=ETHUSDT&limit=1'

      const result = await axios.get(`${host}${endpoint}`)
      // console.log('result.data: ', result.data)

      const ethPrice = result.data.data[0].price

      return ethPrice
    } catch (err) {
      console.error('Error in getEthPrice()')
      throw err
    }
  }
}

export default Price
