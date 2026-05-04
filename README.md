# OphtaCare — Système de gestion d'un cabinet d'ophtalmologie

Application web full-stack pour la gestion d'un cabinet médical ophtalmologique. Elle couvre la prise de rendez-vous, le suivi des patients, le dépôt et l'examen d'analyses médicales, et la gestion du planning du médecin.

---

## Stack technique

**Backend**
- Java 21 / Spring Boot 3.3
- Spring Security + JWT (authentification stateless)
- Spring Data JPA / Hibernate
- MySQL 8
- Maven

**Frontend**
- Angular 17
- TypeScript 5.2
- SCSS

---

## Architecture

```
ophtacare/
├── cabinet-backend/
│   └── src/main/java/com/cabinet/ophtalmologie/
│       ├── controller/
│       ├── service/
│       ├── model/
│       ├── dto/
│       ├── repository/
│       ├── security/
│       └── config/
└── cabinet-frontend/
    └── src/app/
        ├── patient/
        ├── medecin/
        ├── secretaire/
        └── shared/
```

---

## Rôles utilisateur

| Rôle | Fonctionnalités principales |
|------|-----------------------------|
| Patient | Prise de RDV, dépôt d'analyses, consultation du dossier |
| Médecin | Planning, examen des analyses, saisie des consultations |
| Secrétaire | Gestion des patients et des rendez-vous |

---

## Installation

### Prérequis

- Java 21+
- Maven 3.9+
- Node.js 18+ et npm
- MySQL 8

### Base de données

```sql
CREATE DATABASE cabinet_ophtalmo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Backend

```bash
cd cabinet-backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Adapter les identifiants MySQL dans application.properties
mvn spring-boot:run
```

L'API démarre sur `http://localhost:8081`.

Au premier démarrage, deux comptes sont créés automatiquement :

| Rôle | Identifiant | Mot de passe |
|------|-------------|--------------|
| Médecin | `medecin` | `medecin123` |
| Secrétaire | `secretaire` | `secretaire123` |

### Frontend

```bash
cd cabinet-frontend
npm install
npm start
```

L'application est accessible sur `http://localhost:4200`.

---

## Sécurité

Le fichier `application.properties` est exclu du versioning (voir `.gitignore`). Utiliser `application.properties.example` comme modèle. Les tokens JWT expirent après 24 h. Les mots de passe sont hashés avec BCrypt.

---

## API — principaux endpoints

**Authentification**

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/register` | Inscription patient |

**Patients**

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/patients` | Liste des patients |
| GET | `/api/patients/{id}` | Détails d'un patient |
| GET | `/api/patients/search?q=` | Recherche |

**Rendez-vous**

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/rdv` | Tous les rendez-vous |
| GET | `/api/rdv/planning?date=` | Planning d'une journée |
| POST | `/api/rdv` | Soumettre une demande |
| PUT | `/api/rdv/{id}/approuver` | Approuver |
| PUT | `/api/rdv/{id}/refuser` | Refuser |
| DELETE | `/api/rdv/{id}` | Annuler |

**Analyses**

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/analyses/upload` | Déposer une analyse |
| GET | `/api/analyses/patient/{id}` | Analyses d'un patient |
| GET | `/api/analyses/en-attente` | Analyses non examinées |
| PUT | `/api/analyses/{id}/commentaire` | Ajouter un commentaire |

---

## Auteures

Eya Zouch — Ouamyma Khlif  
Université Claude Bernard Lyon 1
