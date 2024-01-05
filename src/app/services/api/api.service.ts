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
   * @param {object} params An object containing the URL params for the get request
   * 
   * @returns {Promise<any>}
   */
  get(endpoint: string, params?: object): Promise<any> {
    return lastValueFrom(this.http.get(`${BASE_API_URL}${endpoint}`, params));
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
