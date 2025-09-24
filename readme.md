# 📋 Test technique - Todo list - Guide de démarrage

Une application de gestion de tâches développée avec Vue 3, NestJS, Prisma et SQLite.

## 🔧 Prérequis

- **Node.js** version 22.17.1
- **pnpm** (gestionnaire de packages)
- **Git**

## 📁 Structure du projet

```
├── backend/          # API NestJS + Prisma + SQLite
├── frontend/         # UI Vue 3 + TypeScript
├── README.md         # Ce fichier
```

---

## 🚀 Installation et démarrage

### 1. Cloner le projet

```bash
git clone https://github.com/Yohann-ybo/test-tech-nestjs.git
cd test-tech-nestjs
```

### 2. Installation des dépendances

#### Backend

```bash
cd backend
pnpm install
```

#### Frontend

```bash
cd frontend
pnpm install
```

---

## 🗄️ Configuration Backend

### 1. Base de données et migrations

```bash
cd backend

# Appliquer les migrations (crée la base SQLite)
pnpm run migrate:dev

# Générer le client Prisma
pnpm run prisma:generate

# Peupler la base avec des données initiales
pnpm run seed
```

### 2. Démarrer le serveur backend

```bash
# Démarrage en mode développement
pnpm run start:dev
```

Le serveur backend sera accessible sur `http://localhost:3000`

### 3. Commandes utiles Backend

```bash
# Ouvrir Prisma Studio (interface graphique BDD)
pnpm run prisma:studio

# Réinitialiser complètement la BDD
pnpm run start:db

# Build pour la production
pnpm run build

# Tests
pnpm run test
```

---

## 🖥️ Configuration Frontend

### 1. Configuration de l'environnement

Créer un fichier `.env` dans le dossier `frontend/` :

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000
```

### 2. Démarrer le serveur frontend

```bash
cd frontend

# Démarrage en mode développement
pnpm run serve
```

Le frontend sera accessible sur `http://localhost:5173`

### 3. Commandes utiles Frontend

```bash
# Build pour la production
pnpm run build

# Prévisualiser le build de production
pnpm run preview

# Vérification TypeScript
pnpm run type-check

# Linting
pnpm run lint
pnpm run lint:fix
```

---

## 🔑 Authentification

### Identifiants de connexion par défaut

- **Email** : `toto@kresus.eu`
- **Mot de passe** : `test`

---

## 🧪 Test de l'API

### Authentification

```bash
# Connexion
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "toto@kresus.eu",
    "password": "test"
  }'
```

Réponse attendue :

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  {
    "email":"toto@kresus.eu",
    "name":"toto",
    "id": 1 //User id in DB
  }
}
```

### Gestion des TODOs

#### Récupérer la liste des TODOs

```bash
curl -X GET http://localhost:3000/todos \
  -H "Authorization: Bearer <votre-token-jwt>"
```

#### Créer un nouveau TODO

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <votre-token-jwt>" \
  -d '{
    "title": "Ma première tâche",
    "content": "Description de ma tâche",
    "priority": "HIGH"
  }'
```

#### Marquer un TODO comme terminé

```bash
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <votre-token-jwt>" \
  -d '{
    "executionDate": "2024-09-24T10:00:00.000Z"
  }'
```

#### Supprimer un TODO

```bash
curl -X DELETE http://localhost:3000/todos/1 \
  -H "Authorization: Bearer <votre-token-jwt>"
```

---

## 📊 Schéma de base de données

### Table Users

- `id` : Identifiant unique
- `email` : Email de l'utilisateur
- `name` : Nom de l'utilisateur
- `password` : Mot de passe

### Table Todos

- `id` : Identifiant unique
- `title` : Titre de la tâche (max 50 caractères)
- `content` : Description (max 256 caractères)
- `priority` : Priorité (`HIGH`, `MEDIUM`, `LOW`)
- `executionDate` : Date de completion (null = non terminé)
- `createdAt` : Date de création
- `updatedAt` : Date de modification
- `authorId` : Référence vers l'utilisateur

---

## ✨ Fonctionnalités

### Interface utilisateur

- ✅ Authentification
- ✅ Liste des tâches avec tri par priorité
- ✅ Ajout de nouvelles tâches
- ✅ Validation des formulaires côté client
- ✅ Marquage terminé/non terminé
- ✅ Suppression de tâches
- ✅ Interface responsive en français

### API Backend

- ✅ Authentication JWT
- ✅ CRUD complet pour les TODOs
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ Protection des routes privées

### Validation des données

- **Titre** : Obligatoire, max 50 caractères
- **Contenu** : Max 256 caractères
- **Priorité** : "HIGH", "MEDIUM", "LOW"
- **Date d'exécution** : Optionnel, format ISO

---

## 🔮 Pistes d'amélioration

### Backend

#### 🔐 **Sécurité et authentification**

- Implémenter le hachage des mots de passe avec bcrypt
- Ajouter un système de refresh tokens pour les sessions longues
- Ajouter la validation des permissions utilisateur au niveau des middlewares

#### 📊 **Performance et scalabilité**

- Implémenter la pagination pour les listes de TODOs (offset/limit)
- Mettre en place un système de logs structurés (Winston/Pino)

#### 🧪 **Qualité du code**

- Terminer d'ajouter une suite de tests unitaires et d'intégration (Jest)
- Implémenter la documentation API automatique avec Swagger/OpenAPI

### Frontend

#### 🚀 Fonctionnalités

- Ajouter une pagination pour les liste des todos

#### 🛠️ **Architecture technique**

- Plugin Auth pour initializeAuth
- Migrer vers Pinia pour la gestion d'état globale
- Implémenter un système de cache côté client (Tanstack Query)
- Ajouter les tests unitaires et e2e (Vitest, Playwright/Cypress)

#### 🔧 **Développement**

- Mettre en place Storybook pour documenter les composants
- Ajouter l'internationalisation (vue-i18n) pour le multi-langues
