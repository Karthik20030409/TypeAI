import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypingService {

  // Fake API for now (works without backend)
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  // 👉 FUNCTION CLIENT IS TALKING ABOUT
  saveTypingResult(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getSampleData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
