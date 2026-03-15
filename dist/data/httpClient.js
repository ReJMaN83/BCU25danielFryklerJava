import { settings } from '../config/env.js';
export default class HttpClient {
    constructor(resource) {
        this._url = settings.BASE_URL + resource;
        this._headers = {
            'content-type': 'application/json',
            'x-apikey': settings.API_KEY,
            'cache-control': 'no-cache'
        };
    }
    async listAll() {
        return await this.getData(this._url);
    }
    async findById(id) {
        return await this.getData(`${this._url}/${id}`);
    }
    async post(data) {
        return await this.save(data);
    }
    async update(id, data) {
        return await this.updateData(`${this._url}/${id}`, data);
    }
    async delete(id) {
        const response = await fetch(`${this._url}/${id}`, {
            method: 'DELETE',
            headers: this._headers
        });
        if (response.ok) {
            return true;
        }
        else {
            throw new Error(`${response.status} ${response.statusText}`);
        }
    }
    async getData(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this._headers
            });
            if (response.ok) {
                const result = await response.json();
                let data;
                if (Array.isArray(result)) {
                    data = result.map(item => {
                        return { ...item, id: item._id };
                    });
                    data.map(item => {
                        delete item._id;
                        return item;
                    });
                }
                else {
                    data = { ...result, id: result._id };
                    delete data._id;
                }
                return data;
            }
            else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }
        catch (error) {
            throw error;
        }
    }
    async save(data) {
        const response = await fetch(this._url, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(data)
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error(response.statusText);
        }
    }
    async updateData(url, data) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: this._headers,
            body: JSON.stringify(data)
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error(response.statusText);
        }
    }
}
