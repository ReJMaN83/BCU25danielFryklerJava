import { settings } from '../config/env.js';

export default class HttpClient {
  #baseUrl = settings.BASE_URL;
  #headers = {
    'Content-Type': 'application/json',
    'x-apikey': settings.API_KEY,
    'cache-control': 'no-cache'
  };

  constructor(resource) {
    this.#baseUrl = `${this.#baseUrl}${resource}`;
  }

  async listAll() {
    return await this.#getData(this.#baseUrl);
  }

  async findById(id) {
    return await this.#getData(`${this.#baseUrl}/${id}`);
  }

  async post(data) {
    return await this.#sendData('POST', this.#baseUrl, data);
  }
  
  async update(id, data) {
  return await this.#sendData('PUT', `${this.#baseUrl}/${id}`, data);
}

  async #getData(url) {
    try {
      const response = await fetch(url, { headers: this.#headers });

      if (response.ok) {
        const result = await response.json();

        if (Array.isArray(result)) {
          const data = result.map(item => ({ ...item, id: item._id }));
          data.map(item => { delete item._id; return item; });
          return data;
        } else {
          const data = { ...result, id: result._id };
          delete data._id;
          return data;
        }
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async #sendData(method, url, data) {
    try {
      const response = await fetch(url, {
        method,
        headers: this.#headers,
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }
}