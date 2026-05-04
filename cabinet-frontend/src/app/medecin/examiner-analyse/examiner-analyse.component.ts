import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnalyseService } from '../../shared/services/analyse.service';
import { RendezVousService } from '../../shared/services/rendez-vous.service';
import { Analyse } from '../../shared/models/models';

@Component({
  selector: 'app-examiner-analyse',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-microscope"></i> Analyses en attente d'examen</h1>
    </div>

    <div class="alert alert-success" *ngIf="successMessage">
      <i class="fas fa-check-circle"></i> {{ successMessage }}
    </div>
    <div class="alert alert-danger" *ngIf="errorMessage">
      <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
    </div>

    <div class="card" *ngFor="let analyse of analyses">
      <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:12px;">
        <div>
          <h3 style="font-size:16px;font-weight:700;">{{ analyse.patientNomComplet }}</h3>
          <p style="color:#64748b;margin-top:4px;font-size:13px;">
            <strong>Type :</strong> {{ analyse.typeAnalyse }} &nbsp;|&nbsp;
            <strong>Fichier :</strong> {{ analyse.fichierNom }} &nbsp;|&nbsp;
            <strong>Déposé le :</strong> {{ analyse.dateDepot | date:'dd/MM/yyyy HH:mm' }}
          </p>
        </div>
        <span class="badge badge-en-attente">En attente</span>
      </div>

      <!-- Aperçu du fichier -->
      <div style="margin:16px 0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#f8fafc;">

        <div style="padding:12px 16px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;
                    display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;font-weight:600;color:#334155;">
            <i class="fas fa-eye" style="margin-right:6px;color:#059669;"></i>
            Aperçu du fichier
          </span>
          <a [href]="getFileUrl(analyse.fichierPath)" target="_blank" class="btn btn-outline btn-sm">
            <i class="fas fa-external-link-alt"></i> Ouvrir dans un nouvel onglet
          </a>
        </div>

        <!-- Image -->
        <div *ngIf="isImage(analyse.fichierNom)"
             style="padding:16px;text-align:center;background:white;">
          <img [src]="getFileUrl(analyse.fichierPath)"
               [alt]="analyse.fichierNom"
               style="max-width:100%;max-height:500px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.1);"
               (error)="onImageError($event)">
        </div>

        <!-- PDF -->
        <div *ngIf="isPdf(analyse.fichierNom)" style="padding:16px;">
          <iframe [src]="getSafeUrl(analyse.fichierPath)"
                  style="width:100%;height:500px;border:none;border-radius:8px;"
                  title="Aperçu PDF">
          </iframe>
        </div>

        <!-- Autre -->
        <div *ngIf="!isImage(analyse.fichierNom) && !isPdf(analyse.fichierNom)"
             style="padding:32px;text-align:center;color:#64748b;">
          <i class="fas fa-file" style="font-size:48px;display:block;margin-bottom:12px;color:#94a3b8;"></i>
          <p>Aperçu non disponible pour ce type de fichier.</p>
          <a [href]="getFileUrl(analyse.fichierPath)" target="_blank"
             class="btn btn-primary" style="margin-top:12px;">
            <i class="fas fa-download"></i> Télécharger
          </a>
        </div>
      </div>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;">

      <div class="form-group">
        <label>
          <i class="fas fa-comment-medical" style="color:#059669;margin-right:6px;"></i>
          Commentaire médical
        </label>
        <textarea class="form-control"
                  [(ngModel)]="commentaires[analyse.id]"
                  placeholder="Rédigez votre avis médical..."
                  rows="3"></textarea>
      </div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button class="btn btn-success" (click)="examiner(analyse)">
          <i class="fas fa-check"></i> Valider — Avis envoyé
        </button>
        <button class="btn btn-danger" (click)="examinerUrgent(analyse)">
          <i class="fas fa-exclamation-triangle"></i> Urgent — Planifier RDV
        </button>
      </div>
    </div>

    <div *ngIf="analyses.length === 0"
         class="card" style="text-align:center;padding:40px;color:#94a3b8;">
      <i class="fas fa-check-circle" style="font-size:48px;color:#16a34a;display:block;margin-bottom:16px;"></i>
      <p style="font-size:16px;">Toutes les analyses ont été examinées !</p>
    </div>
  `
})
export class ExaminerAnalyseComponent implements OnInit {
  analyses: Analyse[] = [];
  commentaires: { [id: number]: string } = {};
  successMessage = '';
  errorMessage = '';

  // ⚠️ Adapte le port si ton backend tourne sur 8080
  private backendUrl = 'http://localhost:8081';

  constructor(
    private analyseService: AnalyseService,
    private rdvService: RendezVousService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void { this.loadAnalyses(); }

  loadAnalyses(): void {
    this.analyseService.getEnAttente().subscribe(list => this.analyses = list);
  }

  getFileUrl(fichierPath: string): string {
    // fichierPath = "uuid.jpeg" (nom du fichier uniquement)
    // URL = http://localhost:8081/files/uploads/analyses/uuid.jpeg
    const fileName = fichierPath.includes('/') ? fichierPath.split('/').pop() : fichierPath;
    return `${this.backendUrl}/files/uploads/analyses/${fileName}`;
  }

  getSafeUrl(fichierPath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getFileUrl(fichierPath));
  }

  isImage(fichierNom: string): boolean {
    if (!fichierNom) return false;
    const ext = fichierNom.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext ?? '');
  }

  isPdf(fichierNom: string): boolean {
    if (!fichierNom) return false;
    return fichierNom.split('.').pop()?.toLowerCase() === 'pdf';
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = `
      <div style="padding:32px;text-align:center;color:#64748b;">
        <i class="fas fa-image" style="font-size:48px;display:block;margin-bottom:12px;color:#94a3b8;"></i>
        <p>Impossible de charger l'image.</p>
      </div>`;
  }

  examiner(analyse: Analyse): void {
    const commentaire = this.commentaires[analyse.id];
    if (!commentaire?.trim()) {
      alert('Veuillez saisir un commentaire médical avant de valider.');
      return;
    }
    this.analyseService.addCommentaire(analyse.id, commentaire).subscribe({
      next: () => {
        this.successMessage = `Analyse de ${analyse.patientNomComplet} examinée avec succès.`;
        this.loadAnalyses();
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: () => { this.errorMessage = 'Erreur lors de la validation.'; }
    });
  }

  examinerUrgent(analyse: Analyse): void {
    const commentaire = this.commentaires[analyse.id] || 'Analyse critique — RDV urgent requis';
    this.analyseService.addCommentaire(analyse.id, commentaire).subscribe(() => {
      this.analyseService.markUrgent(analyse.id).subscribe(() => {
        this.rdvService.createUrgent({
          patientId: analyse.patientId,
          motif: 'Analyse urgente : ' + analyse.typeAnalyse
        }).subscribe({
          next: () => {
            this.successMessage = `RDV urgent créé pour ${analyse.patientNomComplet}.`;
            this.loadAnalyses();
            setTimeout(() => this.successMessage = '', 4000);
          },
          error: () => { this.errorMessage = 'Erreur lors de la création du RDV urgent.'; }
        });
      });
    });
  }
}