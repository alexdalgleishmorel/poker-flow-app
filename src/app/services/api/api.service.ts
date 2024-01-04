import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

export const BASE_API_URL: string = 'http://10.0.0.141:8000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * Makes a get request to the provided endpoint
   * 
   * @param {string} endpoint The target API endpoint 
   * @param {number} itemOffset An optional value for retrieving an array of items
   * @param {number} itemsPerPage An optional value for retrieving an array of items
   * 
   * @returns {Promise<any>}
   */
  get(endpoint: string, itemOffset: number = 0, itemsPerPage: number = 15): Promise<any> {
    return lastValueFrom(this.http.get(`${BASE_API_URL}${endpoint}`, {
      params: {
        itemOffset: itemOffset,
        itemsPerPage: itemsPerPage
      }
    }));
  }

  /**
   * Makes a post request to the provided endpoint
   * 
   * @param {string} endpoint The target API endpoint 
   * @param {object} data An object containing the post request data
   * 
   * @returns {Promise<any>}
   */
  post(endpoint: string, data: object): Promise<any> {
    return lastValueFrom(this.http.post(`${BASE_API_URL}${endpoint}`, data));
  }
}
