import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export const BASE_URL: string = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {}

  getPoolsByUserID(userID: string | undefined) {
    return this.http.get(`${BASE_URL}/pool/user/${userID}`);
  }
}
