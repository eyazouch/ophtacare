# 👁️ OphtaCare — Système de Gestion de Cabinet d'Ophtalmologie

> Application web complète pour la gestion d'un cabinet ophtalmologique : patients, rendez-vous, analyses médicales et tableaux de bord interactifs.

---

## 📋 Table des matières

- [Présentation](#présentation)
- [Technologies utilisées](#technologies-utilisées)
- [Lancement rapide avec Docker](#-lancement-rapide-avec-docker)
- [Lancement manuel sans Docker](#-lancement-manuel-sans-docker)
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

### DevOps
- **Docker & Docker Compose**
- **Nginx** (reverse proxy frontend)

---

## 🐳 Lancement rapide avec Docker

> ✅ **Recommandé** — Aucune installation de Java, Maven, Node ou MySQL requise. Juste Docker !

### Prérequis

| Outil | Téléchargement |
|-------|---------------|
| Docker Desktop | https://www.docker.com/products/docker-desktop/ |

### Structure des fichiers Docker à placer

```
ophtacare/
├── docker-compose.yaml          ← racine du projet
├── init.sql                     ← racine du projet
├── cabinet-backend/
│   └── Dockerfile               ← dans cabinet-backend/
└── cabinet-frontend/
    ├── Dockerfile               ← dans cabinet-frontend/
    ├── nginx.conf               ← dans cabinet-frontend/
    └── src/environments/
        └── environment.prod.ts  ← remplacer le fichier existant
```

### Lancement en 3 commandes

```bash
# 1. Cloner le projet
git clone https://github.com/eyazouch/ophtacare.git
cd ophtacare

# 2. Lancer tous les services (MySQL + Backend + Frontend)
docker-compose up --build

# 3. Ouvrir le navigateur
# http://localhost:4200
```

### Arrêter le projet

```bash
docker-compose down
```

### Arrêter et supprimer les données

```bash
docker-compose down -v
```

> ⚠️ `-v` supprime aussi la base de données MySQL. À utiliser avec précaution.

---

## 💻 Lancement manuel sans Docker

### Prérequis

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

### 1. Cloner le projet

```bash
git clone https://github.com/eyazouch/ophtacare.git
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
  apiUrl: 'http://localhost:8081/api'
};
```

### 5. Démarrer le backend

```bash
cd cabinet-backend
mvn spring-boot:run
```

**Ou via IntelliJ IDEA :**
- Ouvrir le projet `cabinet-backend`
- Configurer le SDK Java 21
- Définir le **Working Directory** sur `cabinet-backend/`
- Clic droit sur `OphtalmologieApplication.java` → **Run**

✅ Le backend est prêt quand vous voyez :
```
Started OphtalmologieApplication in X seconds
✅ Compte MÉDECIN créé
✅ Compte SECRÉTAIRE créé
✅ Créneaux par défaut créés
```

> ⚠️ Après le premier démarrage, exécuter ces commandes SQL :
> ```sql
> USE cabinet_ophtalmo;
> ALTER TABLE rendez_vous MODIFY COLUMN statut VARCHAR(30) NOT NULL;
> ALTER TABLE rendez_vous ADD COLUMN IF NOT EXISTS date_heure_alt DATETIME;
> ```

### 6. Démarrer le frontend

```bash
cd cabinet-frontend
npm install
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
├── docker-compose.yaml             # Orchestration Docker
├── init.sql                        # Initialisation MySQL
│
├── cabinet-backend/                # Spring Boot API
│   ├── Dockerfile
│   ├── src/main/java/com/cabinet/ophtalmologie/
│   │   ├── config/                 # SecurityConfig, WebConfig, DataInitializer
│   │   ├── controller/             # REST Controllers
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── exception/              # Gestion des erreurs
│   │   ├── model/                  # Entités JPA
│   │   │   └── enums/              # Rôles, Statuts, etc.
│   │   ├── repository/             # Spring Data JPA
│   │   ├── security/               # JWT Filter, UserDetailsService
│   │   └── service/                # Logique métier
│   ├── src/main/resources/
│   │   └── application.properties  # Configuration
│   └── pom.xml
│
└── cabinet-frontend/               # Angular SPA
    ├── Dockerfile
    ├── nginx.conf
    ├── src/app/
    │   ├── auth/                   # Login, Register
    │   ├── patient/                # Dashboard, RDV, Analyses, Profil
    │   ├── medecin/                # Dashboard, Planning, Statistiques, Dossiers
    │   ├── secretaire/             # Dashboard, Patients, RDV
    │   └── shared/
    │       ├── components/         # Sidebar
    │       ├── guards/             # AuthGuard
    │       ├── interceptors/       # JWT Interceptor
    │       ├── models/             # Interfaces TypeScript
    │       └── services/           # HTTP Services
    ├── src/environments/
    │   ├── environment.ts          # Dev — URL API backend
    │   └── environment.prod.ts     # Prod — Docker
    └── src/styles.scss             # Design system global
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
| GET | `/files/uploads/analyses/{filename}` | Public | Afficher un fichier |

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
- Le **Working Directory** d'IntelliJ doit pointer vers `cabinet-backend/` pour que les uploads fonctionnent correctement

---

## 👩‍💻 Auteure

**Eya Zouch**

Projet développé dans le cadre d'un cursus en génie logiciel / développement web full-stack.

---

*OphtaCare — Cabinet d'Ophtalmologie* 👁️
