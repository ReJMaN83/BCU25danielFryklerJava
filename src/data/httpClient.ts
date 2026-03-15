import { IHttpClient } from '../interfaces/IHttpClient.js';
import { settings } from '../config/env.js';
import { CourseResponseType } from './responseTypes.js';

export default class HttpClient<T> implements IHttpClient<T> {
  private _url: string;
  private _headers: Record<string, string>;

  constructor(resource: string) {
    this._url = settings.BASE_URL + resource;
    this._headers = {
      'content-type': 'application/json',
      'x-apikey': settings.API_KEY,
      'cache-control': 'no-cache'
    };
  }

  async listAll(): Promise<T> {
    return await this.getData(this._url);
  }

  async findById(id: string): Promise<T> {
    return await this.getData(`${this._url}/${id}`);
  }

  async post(data: T): Promise<T> {
    return await this.save(data);
  }

  async update(id: string, data: T): Promise<T> {
    return await this.updateData(`${this._url}/${id}`, data);
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${this._url}/${id}`, {
      method: 'DELETE',
      headers: this._headers
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  }

  private async getData(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this._headers
      });

      if (response.ok) {
        const result = await response.json() as CourseResponseType[] | CourseResponseType;
        let data;

        if (Array.isArray(result)) {
          data = result.map(item => {
            return { ...item, id: item._id };
          });
          data.map(item => {
            delete item._id;
            return item;
          });
        } else {
          data = { ...result, id: result._id };
          delete data._id;
        }
        return data as T;
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  private async save(data: T): Promise<T> {
    const response = await fetch(this._url, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return await response.json() as T;
    } else {
      throw new Error(response.statusText);
    }
  }

  private async updateData(url: string, data: T): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: this._headers,
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return await response.json() as T;
    } else {
      throw new Error(response.statusText);
    }
  }
}