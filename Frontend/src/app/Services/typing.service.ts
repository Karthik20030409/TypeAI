import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypingService {

  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  signup(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, data);
  }

  verifyOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-email`, data);
  }
  generateText(level: string): Observable<{ text: string }> {
    return this.http.get<{ text: string }>(
      `${this.apiUrl}/text/generate?level=${level}`
    );
  }

}
