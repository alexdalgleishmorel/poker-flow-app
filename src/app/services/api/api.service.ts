import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export const BASE_URL: string = environment.apiBaseURL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {}

  get(endpoint: string) {
    return this.http.get(`${BASE_URL}${endpoint}`);
  }

  post(endpoint: string, options: any) {
    return this.http.post(`${BASE_URL}${endpoint}`, options);
  }
}
