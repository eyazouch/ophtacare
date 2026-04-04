// ===== AUTHENTIFICATION =====
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  cin?: string;
  telephone: string;
  dateNaissance: string;
  adresse?: string;
  sexe?: 'HOMME' | 'FEMME';
  groupeSanguin?: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  userId: number;
  message: string;
}

// ===== PATIENT =====
export interface Patient {
  id: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  cin: string;
  telephone: string;
  email: string;
  dateNaissance: string;
  adresse: string;
  sexe: 'HOMME' | 'FEMME';
  groupeSanguin: string;
  nombreRdv: number;
  nombreAnalyses: number;
}

// ===== RENDEZ-VOUS =====
export interface RendezVous {
  id: number;
  patientId: number;
  patientNomComplet: string;
  dateHeure: string;
  dureeMinutes: number;
  motif: string;
  urgent: boolean;
  statut: 'EN_ATTENTE_APPROBATION' | 'PREVU' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
  dateHeureAlt?: string;
  notesMedecin: string;
  creeParId: number;
  creeParUsername: string;
  dateCreation: string;
}

// ===== ANALYSE =====
export interface Analyse {
  id: number;
  patientId: number;
  patientNomComplet: string;
  typeAnalyse: string;
  fichierPath: string;
  fichierNom: string;
  dateDepot: string;
  commentaireMedecin: string;
  urgent: boolean;
  statut: 'EN_ATTENTE' | 'EXAMINEE' | 'ARCHIVEE';
  dateExamen: string;
}

// ===== CONSULTATION =====
export interface Consultation {
  id: number;
  rendezVousId: number;
  patientId: number;
  patientNomComplet: string;
  diagnostic: string;
  traitement: string;
  observations: string;
  dateConsultation: string;
}

// ===== DASHBOARD =====
export interface Dashboard {
  totalPatients: number;
  totalRdv: number;
  rdvDuJour: number;
  rdvEnAttente: number;
  rdvUrgents: number;
  analysesEnAttente: number;
  totalAnalyses: number;
  rdvAnnules: number;
  tauxAnnulation: number;
  planningDuJour: RendezVous[];
  urgences: RendezVous[];
  analysesAExaminer: Analyse[];
}

// ===== API RESPONSE =====
export interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

// ===== PAGINATION =====
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
