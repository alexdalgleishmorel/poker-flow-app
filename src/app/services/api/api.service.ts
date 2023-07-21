import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { environment } from 'src/environment/environment';

export const BASE_URL: string = isDevMode() ? environment.localApiBaseURL : environment.prodApiBaseURL;

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
