import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Dashboard } from '../models/models';

export interface JourStat {
  label: string;
  date: string;
  count: number;
}

export interface SemaineStat {
  label: string;
  count: number;
}

export interface Statistiques {
  totalPatients: number;
  totalRdv: number;
  totalAnalyses: number;
  rdvUrgents: number;
  rdvAnnules: number;
  rdvPrevus: number;
  rdvTermines: number;
  analysesEnAttente: number;
  analysesExaminees: number;
  tauxAnnulation: number;
  tauxUrgence: number;
  rdvParJour: JourStat[];
  rdvParStatut: Record<string, number>;
  analysesParType: Record<string, number>;
  nouveauxPatientsParSemaine: SemaineStat[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<Dashboard> {
    return this.http.get<Dashboard>(this.apiUrl);
  }

  getStatistiques(): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.apiUrl}/statistiques`);
  }
}