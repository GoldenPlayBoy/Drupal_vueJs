
/**
 * Get recipes from JSON API server
 */

import DrupalJSONAPIClient from './DrupalJSONAPIClient'
import axios from 'axios'
import jsonapiParse from "jsonapi-parse"

class Recipes {

  constructor() {
    this.resourceUri = '/recipes'
    this.jsonapi = new DrupalJSONAPIClient(process.env.contentaJSONAPIBaseUrl)
  }

  async findOneById (id) {
    const options = {
      include: ['image']
    }
    return await this.jsonapi.get(this.resourceUri + '/' + id, options)
  }

  findAllCategoriesFromCache() {
    var cache = `{"data":[{"type":"categories","id":"893ac8d7-ce93-472a-8641-5122e8b01586","attributes":{"internalId":1,"name":"Main course","description":null,"weight":0,"updatedAt":"2017-06-30T14:59:28+0200","path":null},"relationships":{"parent":{"data":[]}},"links":{"self":"https:\/\/dev-contentacms.pantheonsite.io\/api\/categories\/893ac8d7-ce93-472a-8641-5122e8b01586"}},{"type":"categories","id":"b2103ccf-4866-45f1-809d-870be192771f","attributes":{"internalId":2,"name":"Starter","description":null,"weight":0,"updatedAt":"2017-06-30T14:59:28+0200","path":null},"relationships":{"parent":{"data":[]}},"links":{"self":"https:\/\/dev-contentacms.pantheonsite.io\/api\/categories\/b2103ccf-4866-45f1-809d-870be192771f"}},{"type":"categories","id":"d4391f2f-861e-4e00-bf0b-343da766113a","attributes":{"internalId":3,"name":"Snack","description":null,"weight":0,"updatedAt":"2017-06-30T14:59:28+0200","path":null},"relationships":{"parent":{"data":[]}},"links":{"self":"https:\/\/dev-contentacms.pantheonsite.io\/api\/categories\/d4391f2f-861e-4e00-bf0b-343da766113a"}},{"type":"categories","id":"2306ef55-1562-45f3-8232-3b820a632aca","attributes":{"internalId":4,"name":"Salad","description":null,"weight":0,"updatedAt":"2017-06-30T14:59:28+0200","path":null},"relationships":{"parent":{"data":[]}},"links":{"self":"https:\/\/dev-contentacms.pantheonsite.io\/api\/categories\/2306ef55-1562-45f3-8232-3b820a632aca"}}],"links":{"self":"https:\/\/dev-contentacms.pantheonsite.io\/api\/categories?page%5Blimit%5D=20"}}`
    return jsonapiParse.parse(JSON.parse(cache)).data
  }

  async findAllCategories (limit = 20) {
    const options = {
      page: {
        limit
      }
    }
    return await this.jsonapi.get('/categories', options)
  }

  async findAllLatest (limit = 4) {
    const options = {
      sort: {
        sortCreated: {
          path: 'created',
          direction: 'DESC'
        }
      },
      page: {
        limit
      },
      include: ['image', 'image.thumbnail'],
      fields: {
        recipes:['title', 'difficulty', 'image'],
        images: ['name', 'thumbnail'],
        files: ['filename']
      }
    }
    const datas = await this.jsonapi.get(this.resourceUri, options)
    return datas
  }

  /*
  async subRequestsFromCategories (categories) {
    const requests = []
    for (const index in categories) {
      requests.push({
        "requestId": index,
        "uri": "/api/recipes?include=category,image,image.thumbnail&filter[category.name][value]=" + encodeURI(categories[index].name) + '&page[limit]=4',
        "action": "view",
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/vnd.api+json",
        }
      })
    }
    return axios.post("https://dev-contentacms.pantheonsite.io/subrequests?_format=json", requests).then(response => {
      return parse(response).map(r => jsonapiParse.parse(r).data)
    })
  }
  */

  async findAllByCategoryName (categoryName, limit = 4) {
    const options = {
      sort:'-created',
      include: [ 'image', 'image.thumbnail' ],
      filter: {
        categoryName: {
          condition: {
            path: 'category.name',
            value: categoryName
          }
        },
      },
      fields: {
        recipes:['title', 'difficulty', 'image'],
        images: ['name', 'thumbnail'],
        files:['filename']
      },
      page: {
        offset: 0,
        limit: limit,
      }
    }
    return await this.jsonapi.get(this.resourceUri, options)
  }

}

export default new Recipes()

