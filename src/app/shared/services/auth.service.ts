import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  baseUrl = "http://localhost:5015/api"

  createUser(formData: any) {
    return this.http.post(this.baseUrl + '/signup', formData)
  }
  signin(formData: any) {
    return this.http.post(this.baseUrl + '/signin', formData)
  }
}
