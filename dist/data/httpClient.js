var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _HttpClient_instances, _HttpClient_baseUrl, _HttpClient_headers, _HttpClient_getData, _HttpClient_sendData;
import { settings } from '../config/env.js';
class HttpClient {
    constructor(resource) {
        _HttpClient_instances.add(this);
        _HttpClient_baseUrl.set(this, settings.BASE_URL);
        _HttpClient_headers.set(this, {
            'Content-Type': 'application/json',
            'x-apikey': settings.API_KEY,
            'cache-control': 'no-cache'
        });
        __classPrivateFieldSet(this, _HttpClient_baseUrl, `${__classPrivateFieldGet(this, _HttpClient_baseUrl, "f")}${resource}`, "f");
    }
    async listAll() {
        return await __classPrivateFieldGet(this, _HttpClient_instances, "m", _HttpClient_getData).call(this, __classPrivateFieldGet(this, _HttpClient_baseUrl, "f"));
    }
    async findById(id) {
        return await __classPrivateFieldGet(this, _HttpClient_instances, "m", _HttpClient_getData).call(this, `${__classPrivateFieldGet(this, _HttpClient_baseUrl, "f")}/${id}`);
    }
    async post(data) {
        return await __classPrivateFieldGet(this, _HttpClient_instances, "m", _HttpClient_sendData).call(this, 'POST', __classPrivateFieldGet(this, _HttpClient_baseUrl, "f"), data);
    }
    async update(id, data) {
        return await __classPrivateFieldGet(this, _HttpClient_instances, "m", _HttpClient_sendData).call(this, 'PUT', `${__classPrivateFieldGet(this, _HttpClient_baseUrl, "f")}/${id}`, data);
    }
    async delete(id) {
        try {
            const response = await fetch(`${__classPrivateFieldGet(this, _HttpClient_baseUrl, "f")}/${id}`, {
                method: 'DELETE',
                headers: __classPrivateFieldGet(this, _HttpClient_headers, "f")
            });
            if (response.ok) {
                return true;
            }
            else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }
        catch (error) {
            throw error;
        }
    }
}
_HttpClient_baseUrl = new WeakMap(), _HttpClient_headers = new WeakMap(), _HttpClient_instances = new WeakSet(), _HttpClient_getData = async function _HttpClient_getData(url) {
    try {
        const response = await fetch(url, { headers: __classPrivateFieldGet(this, _HttpClient_headers, "f") });
        if (response.ok) {
            const result = await response.json();
            if (Array.isArray(result)) {
                const data = result.map((item) => ({ ...item, id: item._id }));
                data.map((item) => { delete item._id; return item; });
                return data;
            }
            else {
                const data = { ...result, id: result._id };
                delete data._id;
                return data;
            }
        }
        else {
            throw new Error(`${response.status} ${response.statusText}`);
        }
    }
    catch (error) {
        throw error;
    }
}, _HttpClient_sendData = async function _HttpClient_sendData(method, url, data) {
    try {
        const response = await fetch(url, {
            method,
            headers: __classPrivateFieldGet(this, _HttpClient_headers, "f"),
            body: JSON.stringify(data)
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error(`${response.status} ${response.statusText}`);
        }
    }
    catch (error) {
        throw error;
    }
};
export default HttpClient;
