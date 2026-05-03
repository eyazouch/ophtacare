import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';

// Shared
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Patient
import { PatientDashboardComponent } from './patient/dashboard/dashboard.component';
import { MesRdvComponent } from './patient/mes-rdv/mes-rdv.component';
import { NouveauRdvComponent } from './patient/nouveau-rdv/nouveau-rdv.component';
import { MesAnalysesComponent } from './patient/mes-analyses/mes-analyses.component';
import { UploadAnalyseComponent } from './patient/upload-analyse/upload-analyse.component';
import { ProfilComponent } from './patient/profil/profil.component';

// Médecin
import { MedecinDashboardComponent } from './medecin/dashboard/dashboard.component';
import { DossierPatientComponent } from './medecin/dossier-patient/dossier-patient.component';
import { ExaminerAnalyseComponent } from './medecin/examiner-analyse/examiner-analyse.component';
import { PlanningComponent } from './medecin/planning/planning.component';
import { StatistiquesComponent } from './medecin/statistiques/statistiques.component';

// Secrétaire
import { SecretaireDashboardComponent } from './secretaire/dashboard/dashboard.component';
import { GestionPatientsComponent } from './secretaire/gestion-patients/gestion-patients.component';
import { NouveauPatientComponent } from './secretaire/nouveau-patient/nouveau-patient.component';
import { GestionRdvComponent } from './secretaire/gestion-rdv/gestion-rdv.component';
import { NouveauRdvSecretaireComponent } from './secretaire/nouveau-rdv-secretaire/nouveau-rdv-secretaire.component';
import { SecretairePlanningComponent } from './secretaire/planning/secretaire-planning.component';
import { ModifierRdvComponent } from './secretaire/modifier-rdv/modifier-rdv.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    PatientDashboardComponent,
    MesRdvComponent,
    NouveauRdvComponent,
    MesAnalysesComponent,
    UploadAnalyseComponent,
    ProfilComponent,
    MedecinDashboardComponent,
    DossierPatientComponent,
    ExaminerAnalyseComponent,
    PlanningComponent,
    StatistiquesComponent,
    SecretaireDashboardComponent,
    GestionPatientsComponent,
    NouveauPatientComponent,
    GestionRdvComponent,
    NouveauRdvSecretaireComponent,
    SecretairePlanningComponent,
    ModifierRdvComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
