import { settings } from '../config/env.js';

export default class HttpClient<T> {
  readonly #baseUrl: string = settings.BASE_URL;
  readonly #headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-apikey': settings.API_KEY,
    'cache-control': 'no-cache'
  };

  constructor(resource: string) {
    this.#baseUrl = `${this.#baseUrl}${resource}`;
  }

  async listAll(): Promise<T> {
    return await this.#getData(this.#baseUrl);
  }

  async findById(id: string): Promise<T> {
    return await this.#getData(`${this.#baseUrl}/${id}`);
  }

  async post(data: T): Promise<T> {
    return await this.#sendData('POST', this.#baseUrl, data);
  }

  async update(id: string, data: T): Promise<T> {
    return await this.#sendData('PUT', `${this.#baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.#baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.#headers
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async #getData(url: string): Promise<T> {
    try {
      const response = await fetch(url, { headers: this.#headers });

      if (response.ok) {
        const result = await response.json();

        if (Array.isArray(result)) {
          const data = result.map((item: any) => ({ ...item, id: item._id }));
          data.map((item: any) => { delete item._id; return item; });
          return data as T;
        } else {
          const data = { ...result, id: result._id };
          delete data._id;
          return data as T;
        }
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async #sendData(method: string, url: string, data: T): Promise<T> {
    try {
      const response = await fetch(url, {
        method,
        headers: this.#headers,
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json() as T;
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }
}