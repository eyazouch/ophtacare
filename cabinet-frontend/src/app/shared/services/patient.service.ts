import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patient, Page, ApiResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;
  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 20): Observable<Page<Patient>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Patient>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/user/${userId}`);
  }

  search(query: string): Observable<Patient[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Patient[]>(`${this.apiUrl}/search`, { params });
  }

  update(id: number, data: Partial<Patient>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, data);
  }
}
