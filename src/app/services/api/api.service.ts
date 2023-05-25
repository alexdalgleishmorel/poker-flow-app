import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL: string = 'pokerflow.io/api';

  constructor(
    private http: HttpClient
  ) {}

  getData(endpoint: string, options: any) {
    return this.http.get(`${this.baseURL}/${endpoint}`, options);
  }
}
