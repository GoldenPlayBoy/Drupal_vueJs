/**
 * Fetch resources from our JSON API server and format
 * result automatically with "jsonapi-parse", to put
 * "included" objects inside "data" objects; so that
 * they are ready to be consumed by our template
 * 
 * example usage :
 * 
 * const queryParams = {
 *    sort: {
 *      sortCreated: {
 *        direction: 'DESC'
 *        path: 'created',
 *      }
 *    },
 *    include: ['tags'],   
 *  }
 *  const datas = await this.jsonapi.get('/recipes', queryParams)
 * 
 */
import axios from 'axios'
import { buildQueryString } from 'd8-jsonapi-querystring'
import jsonapiParse from "jsonapi-parse"

class JSONAPIClient {

  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  /**
   * http GET request on JSON-API server
   * 
   * @param {string} entity Uri . eg : "/recipes"
   * @param {object} JSONAPI query parameters as an objct, @see JSONAPIQueryBuilder
   */
  async get (uri, queryParams = {}) {
    const queryString = buildQueryString(queryParams)
    let result = null
    const url = encodeURI(this.baseUrl) + encodeURI(uri) + '?' + queryString
    try {
      const response = await axios.get(url)
      const parsedJson = jsonapiParse.parse(response.data)
      result = parsedJson.data
    } catch (e) {
      console.error(e.message)
    }
    return result
  }

}

export default JSONAPIClient
