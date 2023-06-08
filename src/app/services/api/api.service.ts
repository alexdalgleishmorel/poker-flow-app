import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL: string = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient
  ) {}

  getPoolsByUserID(userID: string) {
    return this.http.get(`${this.baseURL}/pool/user/${userID}`);
  }
}
