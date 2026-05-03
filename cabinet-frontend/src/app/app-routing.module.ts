import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { PatientDashboardComponent } from './patient/dashboard/dashboard.component';
import { MesRdvComponent } from './patient/mes-rdv/mes-rdv.component';
import { NouveauRdvComponent } from './patient/nouveau-rdv/nouveau-rdv.component';
import { MesAnalysesComponent } from './patient/mes-analyses/mes-analyses.component';
import { UploadAnalyseComponent } from './patient/upload-analyse/upload-analyse.component';
import { ProfilComponent } from './patient/profil/profil.component';

import { MedecinDashboardComponent } from './medecin/dashboard/dashboard.component';
import { DossierPatientComponent } from './medecin/dossier-patient/dossier-patient.component';
import { ExaminerAnalyseComponent } from './medecin/examiner-analyse/examiner-analyse.component';
import { PlanningComponent } from './medecin/planning/planning.component';
import { StatistiquesComponent } from './medecin/statistiques/statistiques.component';

import { SecretaireDashboardComponent } from './secretaire/dashboard/dashboard.component';
import { GestionPatientsComponent } from './secretaire/gestion-patients/gestion-patients.component';
import { NouveauPatientComponent } from './secretaire/nouveau-patient/nouveau-patient.component';
import { GestionRdvComponent } from './secretaire/gestion-rdv/gestion-rdv.component';
import { NouveauRdvSecretaireComponent } from './secretaire/nouveau-rdv-secretaire/nouveau-rdv-secretaire.component';
import { SecretairePlanningComponent } from './secretaire/planning/secretaire-planning.component';
import { ModifierRdvComponent } from './secretaire/modifier-rdv/modifier-rdv.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'patient',
    canActivate: [AuthGuard],
    data: { roles: ['PATIENT'] },
    children: [
      { path: 'dashboard', component: PatientDashboardComponent },
      { path: 'mes-rdv', component: MesRdvComponent },
      { path: 'nouveau-rdv', component: NouveauRdvComponent },
      { path: 'mes-analyses', component: MesAnalysesComponent },
      { path: 'upload-analyse', component: UploadAnalyseComponent },
      { path: 'profil', component: ProfilComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'medecin',
    canActivate: [AuthGuard],
    data: { roles: ['MEDECIN'] },
    children: [
      { path: 'dashboard', component: MedecinDashboardComponent },
      { path: 'dossier-patient/:id', component: DossierPatientComponent },
      { path: 'examiner-analyse', component: ExaminerAnalyseComponent },
      { path: 'planning', component: PlanningComponent },
      { path: 'statistiques', component: StatistiquesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'secretaire',
    canActivate: [AuthGuard],
    data: { roles: ['SECRETAIRE'] },
    children: [
      { path: 'dashboard', component: SecretaireDashboardComponent },
      { path: 'gestion-patients', component: GestionPatientsComponent },
      { path: 'nouveau-patient', component: NouveauPatientComponent },
      { path: 'gestion-rdv', component: GestionRdvComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // Dans le children de 'secretaire', ajouter :
      { path: 'planning', component: SecretairePlanningComponent },
      { path: 'nouveau-rdv', component: NouveauRdvSecretaireComponent },
      { path: 'rdv/modifier/:id', component: ModifierRdvComponent }
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
