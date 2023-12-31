import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export const BASE_URL: string = 'http://10.0.0.141:8000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {}

  get(endpoint: string, itemOffset: number = 0, itemsPerPage: number = 15) {
    return this.http.get(`${BASE_URL}${endpoint}`, {
      params: {
        itemOffset: itemOffset,
        itemsPerPage: itemsPerPage
      }
    });
  }

  post(endpoint: string, options: any) {
    return this.http.post(`${BASE_URL}${endpoint}`, options);
  }
}
