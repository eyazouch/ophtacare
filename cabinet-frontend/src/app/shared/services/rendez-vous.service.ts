import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RendezVous, ApiResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RendezVousService {
  private apiUrl = `${environment.apiUrl}/rdv`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<RendezVous[]> { return this.http.get<RendezVous[]>(this.apiUrl); }
  getById(id: number): Observable<RendezVous> { return this.http.get<RendezVous>(`${this.apiUrl}/${id}`); }
  getByPatient(patientId: number): Observable<RendezVous[]> { return this.http.get<RendezVous[]>(`${this.apiUrl}/patient/${patientId}`); }

  getCreneauxDisponibles(date: string): Observable<string[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<string[]>(`${this.apiUrl}/disponibilites`, { params });
  }

  getPlanning(date: string): Observable<RendezVous[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<RendezVous[]>(`${this.apiUrl}/planning`, { params });
  }

  create(rdv: Partial<RendezVous>): Observable<ApiResponse> { return this.http.post<ApiResponse>(this.apiUrl, rdv); }
  createUrgent(rdv: Partial<RendezVous>): Observable<ApiResponse> { return this.http.post<ApiResponse>(`${this.apiUrl}/urgent`, rdv); }
  update(id: number, rdv: Partial<RendezVous>): Observable<ApiResponse> { return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, rdv); }
  cancel(id: number): Observable<ApiResponse> { return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`); }
  getDemandesEnAttente(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.apiUrl}/demandes`);
  }

  approuver(id: number, dateHeureChoisie: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}/approuver`, { dateHeureChoisie });
  }

  refuser(id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}/refuser`, {});
  }
}
