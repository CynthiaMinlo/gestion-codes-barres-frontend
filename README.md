# GestionCodes — Frontend React + Vite

Interface utilisateur premium pour l'application de gestion de codes-barres.

## Stack

- **React 18** + **Vite** — build ultra-rapide
- **Tailwind CSS** — design system utility-first
- **React Router v6** — navigation SPA
- **Axios** — appels API vers Laravel
- **Recharts** — graphiques du dashboard
- **Lucide React** — icônes premium
- **React Hot Toast** — notifications élégantes

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Page d'accueil publique |
| `/login` | Login | Connexion sécurisée |
| `/dashboard` | Dashboard | Tableau de bord + graphiques |
| `/produits` | Produits | CRUD complet des produits |
| `/categories` | Catégories | Gestion des catégories |
| `/fournisseurs` | Fournisseurs | Gestion des fournisseurs |
| `/codes-barres` | Codes-barres | Génération EAN13/QR/CODE128... |
| `/mouvements` | Mouvements | Entrées/sorties de stock |
| `/scans` | Scanner | Scan de codes-barres |
| `/utilisateurs` | Utilisateurs | Gestion des utilisateurs |
| `/impressions` | Impressions | Historique des impressions |
| `/rapports` | Rapports | Statistiques et graphiques |

## Installation

### Prérequis

- Node.js 18+
- Backend Laravel 13 démarré sur `http://127.0.0.1:8000`

### Étapes

```bash
# 1. Entrer dans le dossier
cd gestion-codes-barres-frontend

# 2. Installer les dépendances
npm install

# 3. Démarrer en développement
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

### Build production

```bash
npm run build
npm run preview
```

## Configuration

Le proxy Vite redirige automatiquement `/api` vers `http://127.0.0.1:8000/api`.
Aucun fichier `.env` requis pour le développement.

## Architecture

```
src/
├── api/           → Instance Axios configurée
├── context/       → AuthContext (état de connexion)
├── components/
│   ├── layout/    → Sidebar, Topbar, Layout
│   └── ui/        → Modal, StatCard, BadgeStock, Loader, EmptyState
└── pages/
    ├── Landing.jsx    → Page d'accueil
    ├── auth/          → Login
    ├── Dashboard.jsx  → Tableau de bord
    ├── produits/      → Gestion produits
    ├── categories/    → Gestion catégories
    ├── fournisseurs/  → Gestion fournisseurs
    ├── codes-barres/  → Génération codes
    ├── stocks/        → Mouvements + Scanner
    ├── utilisateurs/  → Gestion utilisateurs
    ├── impressions/   → Impressions étiquettes
    └── rapports/      → Statistiques
```

---

© 2026 GestionCodes — Tous droits réservés. Projet académique de Génie Logiciel.
