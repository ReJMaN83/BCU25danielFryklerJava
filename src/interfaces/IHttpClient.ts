export interface IHttpClient<T> {
  listAll(): Promise<T>;
  findById(id: string): Promise<T>;
  post(data: T): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}