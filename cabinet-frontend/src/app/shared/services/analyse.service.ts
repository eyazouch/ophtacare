import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Analyse, ApiResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AnalyseService {
  private apiUrl = `${environment.apiUrl}/analyses`;
  constructor(private http: HttpClient) {}

  upload(patientId: number, typeAnalyse: string, fichier: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('patientId', patientId.toString());
    formData.append('typeAnalyse', typeAnalyse);
    formData.append('fichier', fichier);
    return this.http.post<ApiResponse>(`${this.apiUrl}/upload`, formData);
  }

  getByPatient(patientId: number): Observable<Analyse[]> { return this.http.get<Analyse[]>(`${this.apiUrl}/patient/${patientId}`); }
  getById(id: number): Observable<Analyse> { return this.http.get<Analyse>(`${this.apiUrl}/${id}`); }
  getEnAttente(): Observable<Analyse[]> { return this.http.get<Analyse[]>(`${this.apiUrl}/en-attente`); }

  addCommentaire(id: number, commentaire: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}/commentaire`, { commentaire });
  }

  markUrgent(id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}/urgent`, {});
  }
}
