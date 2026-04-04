# 👁️ OphtaCare — Système de Gestion de Cabinet d'Ophtalmologie

> Application web complète pour la gestion d'un cabinet ophtalmologique : patients, rendez-vous, analyses médicales et tableaux de bord interactifs.

---

## 📋 Table des matières

- [Présentation](#présentation)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation et configuration](#installation-et-configuration)
- [Lancement du projet](#lancement-du-projet)
- [Comptes par défaut](#comptes-par-défaut)
- [Fonctionnalités](#fonctionnalités)
- [Architecture du projet](#architecture-du-projet)
- [API Endpoints](#api-endpoints)

---

## 🎯 Présentation

**OphtaCare** est une application web full-stack permettant de gérer un cabinet d'ophtalmologie avec trois rôles distincts :

| Rôle | Description |
|------|-------------|
| 🩺 **Médecin** | Consulte les dossiers patients, examine les analyses, planifie les RDV urgents |
| 👩‍💼 **Secrétaire** | Gère les patients, approuve les demandes de RDV, organise le planning |
| 🧑‍⚕️ **Patient** | Prend des rendez-vous, dépose ses analyses, reçoit les avis médicaux |

---

## 🛠️ Technologies utilisées

### Backend
- **Java 21** (LTS)
- **Spring Boot 3.3.5**
- **Spring Security + JWT** (authentification stateless)
- **Spring Data JPA + Hibernate**
- **MySQL 8**
- **Maven 3.9**
- **Lombok**

### Frontend
- **Angular 17**
- **TypeScript**
- **SCSS**
- **Font Awesome 6**
- **Google Fonts** (Plus Jakarta Sans, DM Serif Display)

---

## ✅ Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé :

| Outil | Version minimale | Vérification |
|-------|-----------------|--------------|
| Java JDK | 21 LTS | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Angular CLI | 17+ | `ng version` |
| MySQL | 8.0+ | `mysql --version` |

### Installation des outils manquants

**Java 21 (Temurin recommandé)**
```
https://adoptium.net/ → JDK 21 LTS
```
> ⚠️ Définir la variable d'environnement `JAVA_HOME` pointant vers le dossier JDK

**Maven**
```
https://maven.apache.org/download.cgi → apache-maven-3.9.x-bin.zip
```
> Extraire dans `C:\maven` et ajouter `C:\maven\bin` au PATH

**Node.js + Angular CLI**
```bash
# Télécharger Node.js LTS sur https://nodejs.org/
npm install -g @angular/cli
```

**MySQL**
```
https://dev.mysql.com/downloads/installer/
```

---

## ⚙️ Installation et configuration

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/ophtacare.git
cd ophtacare
```

### 2. Configurer la base de données MySQL

Se connecter à MySQL :
```bash
mysql -u root -p
```

Créer la base de données :
```sql
CREATE DATABASE cabinet_ophtalmo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ajuster la colonne statut (obligatoire) :
```sql
USE cabinet_ophtalmo;
ALTER TABLE rendez_vous MODIFY COLUMN statut VARCHAR(30) NOT NULL;
ALTER TABLE rendez_vous ADD COLUMN IF NOT EXISTS date_heure_alt DATETIME;
```

> ⚠️ Ces commandes SQL ne sont nécessaires qu'après le premier démarrage du backend.

### 3. Configurer le backend

Ouvrir le fichier :
```
cabinet-backend/src/main/resources/application.properties
```

Modifier les lignes suivantes :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cabinet_ophtalmo?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE_MYSQL

server.port=8081
```

> 💡 Si vous changez le port, mettez à jour `environment.ts` dans le frontend en conséquence.

### 4. Configurer le frontend

Ouvrir le fichier :
```
cabinet-frontend/src/environments/environment.ts
```

Vérifier que le port correspond à celui du backend :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api'  // Adapter si besoin
};
```

---

## 🚀 Lancement du projet

### Démarrer le backend

```bash
cd cabinet-backend

# Avec Maven (CMD/Terminal)
mvn spring-boot:run
```

**Ou via IntelliJ IDEA :**
- Ouvrir le projet `cabinet-backend`
- Configurer le SDK Java 21
- Clic droit sur `OphtalmologieApplication.java` → **Run**

✅ Le backend est prêt quand vous voyez :
```
Started OphtalmologieApplication in X seconds
✅ Compte MÉDECIN créé
✅ Compte SECRÉTAIRE créé
✅ Créneaux par défaut créés
```

> ⚠️ Après le premier démarrage, exécuter les commandes SQL de la section 2.

### Démarrer le frontend

```bash
cd cabinet-frontend

# Installer les dépendances (première fois uniquement)
npm install

# Lancer le serveur de développement
ng serve
```

✅ Le frontend est disponible sur : **http://localhost:4200**

---

## 👤 Comptes par défaut

Ces comptes sont créés automatiquement au premier démarrage :

| Rôle | Username | Mot de passe |
|------|----------|--------------|
| 🩺 Médecin | `medecin` | `medecin123` |
| 👩‍💼 Secrétaire | `secretaire` | `secretaire123` |
| 🧑‍⚕️ Patient | *(créer via Register)* | *(au choix)* |

---

## ✨ Fonctionnalités

### 🧑‍⚕️ Patient
- ✅ Inscription et connexion
- ✅ Demande de rendez-vous avec 1 ou 2 créneaux proposés
- ✅ Upload d'analyses médicales (PDF, JPEG, PNG — max 10 Mo)
- ✅ Consultation de ses RDV et analyses
- ✅ Réception des avis médicaux
- ✅ Alertes dashboard : RDV urgent, RDV approuvé
- ✅ Annulation d'un RDV prévu

### 👩‍💼 Secrétaire
- ✅ Enregistrement de nouveaux patients
- ✅ Approbation / refus des demandes de RDV
- ✅ Gestion du planning journalier
- ✅ Alertes : demandes en attente, RDV urgents
- ✅ Recherche et consultation des dossiers patients

### 🩺 Médecin
- ✅ Vue du planning quotidien
- ✅ Consultation des dossiers patients complets
- ✅ Examen des analyses avec aperçu image/PDF
- ✅ Ajout de commentaires médicaux
- ✅ Création de RDV urgents automatiques
- ✅ Statistiques avancées avec graphiques :
  - Graphique barres : RDV par jour (7 jours)
  - Donut : répartition par statut
  - Barres horizontales : analyses par type
  - Courbe : activité patients (4 semaines)
  - Jauges : taux annulation, urgence

---

## 🏗️ Architecture du projet

```
ophtacare/
│
├── cabinet-backend/                    # Spring Boot API
│   ├── src/main/java/com/cabinet/ophtalmologie/
│   │   ├── config/                     # SecurityConfig, WebConfig, DataInitializer
│   │   ├── controller/                 # REST Controllers
│   │   ├── dto/                        # Data Transfer Objects
│   │   ├── exception/                  # Gestion des erreurs
│   │   ├── model/                      # Entités JPA
│   │   │   └── enums/                  # Rôles, Statuts, etc.
│   │   ├── repository/                 # Spring Data JPA
│   │   ├── security/                   # JWT Filter, UserDetailsService
│   │   └── service/                    # Logique métier
│   ├── src/main/resources/
│   │   └── application.properties      # Configuration
│   └── pom.xml
│
└── cabinet-frontend/                   # Angular SPA
    ├── src/app/
    │   ├── auth/                       # Login, Register
    │   ├── patient/                    # Dashboard, RDV, Analyses, Profil
    │   ├── medecin/                    # Dashboard, Planning, Statistiques, Dossiers
    │   ├── secretaire/                 # Dashboard, Patients, RDV
    │   └── shared/
    │       ├── components/             # Sidebar
    │       ├── guards/                 # AuthGuard
    │       ├── interceptors/           # JWT Interceptor
    │       ├── models/                 # Interfaces TypeScript
    │       └── services/              # HTTP Services
    ├── src/environments/
    │   └── environment.ts              # URL API backend
    └── src/styles.scss                 # Design system global
```

---

## 📡 API Endpoints

### Authentification
| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| POST | `/api/auth/login` | Public | Connexion |
| POST | `/api/auth/register` | Public | Inscription patient |

### Patients
| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| GET | `/api/patients` | Médecin, Secrétaire | Liste patients |
| GET | `/api/patients/{id}` | Tous | Détails patient |
| GET | `/api/patients/user/{userId}` | Tous | Patient par userId |
| GET | `/api/patients/search?q=...` | Médecin, Secrétaire | Recherche |

### Rendez-vous
| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| GET | `/api/rdv` | Médecin, Secrétaire | Tous les RDV |
| GET | `/api/rdv/patient/{id}` | Tous | RDV d'un patient |
| GET | `/api/rdv/planning?date=...` | Médecin, Secrétaire | Planning journée |
| GET | `/api/rdv/disponibilites?date=...` | Tous | Créneaux libres |
| GET | `/api/rdv/demandes` | Médecin, Secrétaire | Demandes en attente |
| POST | `/api/rdv` | Patient, Secrétaire | Soumettre demande |
| POST | `/api/rdv/urgent` | Médecin | Créer RDV urgent |
| PUT | `/api/rdv/{id}/approuver` | Secrétaire | Approuver demande |
| PUT | `/api/rdv/{id}/refuser` | Secrétaire | Refuser demande |
| DELETE | `/api/rdv/{id}` | Patient, Secrétaire | Annuler RDV |

### Analyses
| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| POST | `/api/analyses/upload` | Patient | Déposer analyse |
| GET | `/api/analyses/patient/{id}` | Tous | Analyses d'un patient |
| GET | `/api/analyses/en-attente` | Médecin | Analyses non examinées |
| PUT | `/api/analyses/{id}/commentaire` | Médecin | Ajouter commentaire |
| PUT | `/api/analyses/{id}/urgent` | Médecin | Marquer urgente |

### Dashboard & Statistiques
| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| GET | `/api/dashboard` | Médecin, Secrétaire | Statistiques générales |
| GET | `/api/dashboard/statistiques` | Médecin | Statistiques avancées |

### Fichiers statiques
| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| GET | `/files/analyses/{filename}` | Public | Télécharger un fichier |

---

## 🔐 Sécurité

- Authentification par **JWT** (JSON Web Token) avec expiration 24h
- Chaque route est protégée par **rôle** (`MEDECIN`, `SECRETAIRE`, `PATIENT`)
- Les mots de passe sont hashés avec **BCrypt**
- **CORS** configuré pour `http://localhost:4200`
- Les fichiers uploadés sont stockés côté serveur dans `uploads/analyses/`

---

## 📝 Notes de développement

- Les créneaux disponibles sont automatiquement générés au démarrage :
  - Lundi–Vendredi : 8h–12h et 14h–18h (tranches de 30 min)
  - Samedi : 8h–12h
- Les tableaux de bord se rafraîchissent automatiquement toutes les **30 secondes**
- Les fichiers acceptés pour les analyses : **PDF, JPEG, PNG** (max 10 Mo)

---

## 👩‍💻 Auteur
Eya Zouch

Projet développé dans le cadre d'un cursus en génie logiciel / développement web full-stack.

---

*OphtaCare — Cabinet d'Ophtalmologie* 👁️
