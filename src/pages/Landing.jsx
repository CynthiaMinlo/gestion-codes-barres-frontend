import { useNavigate } from 'react-router-dom';
import {
  ScanBarcode, Package, Barcode, Printer,
  ScanLine, BarChart3, Shield, ArrowRight,
  CheckCircle2, Zap, Globe, Lock,
} from 'lucide-react';

// ── Données ──────────────────────────────────────────────────────
const features = [
  {
    icon: Barcode, couleur: 'blue',
    titre: 'Génération multi-formats',
    desc: 'Générez instantanément des codes EAN-13, QR Code, Code 128, UPC et Code 39. Téléchargez en PNG ou PDF.',
    tags: ['EAN-13','QR Code','Code 128','UPC','Code 39'],
  },
  {
    icon: Package, couleur: 'green',
    titre: 'Gestion des stocks',
    desc: 'Suivez les entrées et sorties en temps réel. Alertes automatiques quand le stock descend sous le seuil.',
    tags: ['Entrées','Sorties','Inventaire','Alertes'],
  },
  {
    icon: Printer, couleur: 'orange',
    titre: "Impression d'étiquettes",
    desc: "Impression unitaire ou en série avec personnalisation de la taille, couleur et texte. Prévisualisation avant impression.",
    tags: ['Unitaire','En série','Personnalisable'],
  },
  {
    icon: ScanLine, couleur: 'purple',
    titre: 'Lecture de codes-barres',
    desc: 'Scan via scanner USB, webcam ou smartphone. Affichage instantané du nom, prix et stock du produit.',
    tags: ['Scanner USB','Webcam','Smartphone'],
  },
  {
    icon: BarChart3, couleur: 'blue',
    titre: 'Rapports & Statistiques',
    desc: 'Tableau de bord avec indicateurs clés. Générez des rapports et exportez en PDF, Excel ou CSV.',
    tags: ['Dashboard','PDF','Excel','CSV'],
  },
  {
    icon: Shield, couleur: 'green',
    titre: 'Sécurité & Rôles',
    desc: "Authentification sécurisée avec Sanctum. Trois niveaux d'accès : Administrateur, Gestionnaire, Opérateur.",
    tags: ['Sanctum','RBAC','Tokens'],
  },
];

const couleurs = {
  blue:   { bg:'bg-blue-50',   icon:'text-blue-600',   border:'border-blue-100'   },
  green:  { bg:'bg-emerald-50',icon:'text-emerald-600',border:'border-emerald-100'},
  orange: { bg:'bg-orange-50', icon:'text-orange-600', border:'border-orange-100' },
  purple: { bg:'bg-violet-50', icon:'text-violet-600', border:'border-violet-100' },
};

const roles = [
  {
    titre:'Administrateur', emoji:'👑',
    bg:'bg-gradient-to-br from-blue-50 to-blue-100', border:'border-blue-200', text:'text-blue-900',
    perms:['Gestion complète des utilisateurs','Attribution et modification des rôles','Accès à tous les modules','Configuration du système'],
  },
  {
    titre:'Gestionnaire', emoji:'📊',
    bg:'bg-gradient-to-br from-emerald-50 to-emerald-100', border:'border-emerald-200', text:'text-emerald-900',
    perms:['Gestion des produits et catégories','Génération de codes-barres','Suivi des stocks en temps réel','Accès aux rapports et exports'],
  },
  {
    titre:'Opérateur', emoji:'⚡',
    bg:'bg-gradient-to-br from-orange-50 to-orange-100', border:'border-orange-200', text:'text-orange-900',
    perms:['Scan des codes-barres produits','Enregistrement des sorties de stock','Impression des étiquettes','Consultation des produits'],
  },
];

const stats = [
  { val:'5+',    label:'Formats codes-barres' },
  { val:'3',     label:"Niveaux d'accès"       },
  { val:'REST',  label:'API Laravel 13'        },
  { val:'100%',  label:'Made in Cameroun 🇨🇲'  },
];

const stack = [
  { nom:'Laravel 13', emoji:'⚡' },
  { nom:'React 18',   emoji:'⚛️' },
  { nom:'PHP 8.3',    emoji:'🐘' },
  { nom:'MySQL',      emoji:'🗄️' },
  { nom:'Sanctum',    emoji:'🔐' },
  { nom:'Vite',       emoji:'🚀' },
  { nom:'Tailwind',   emoji:'🎨' },
  { nom:'Recharts',   emoji:'📊' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ══════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100
                      px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-xl shadow-sm">
            <ScanBarcode className="w-5 h-5 text-white"/>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-none">GestionCodes</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Codes-barres pour PME</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {['Fonctionnalités','Formats','Architecture','Équipe'].map(l => (
            <span key={l}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600
                             hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors">
              {l}
            </span>
          ))}
        </div>

        <button onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600
                           hover:bg-primary-700 text-white rounded-xl text-sm
                           font-semibold transition-all shadow-sm hover:shadow-md">
          Se connecter <ArrowRight size={15}/>
        </button>
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 lg:px-12 py-24 text-center"
               style={{background:'linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 40%, #fff 100%)'}}>

        {/* Grille décorative */}
        <div className="absolute inset-0 opacity-30"
             style={{backgroundImage:'radial-gradient(circle, #185FA5 1px, transparent 1px)',
                     backgroundSize:'40px 40px'}}/>

        <div className="relative z-10 max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-primary-200
                          rounded-full px-4 py-2 text-xs font-bold text-primary-800
                          uppercase tracking-wider mb-8 shadow-sm">
            <Zap size={12} className="text-primary-600"/>
            Projet académique · Génie Logiciel 2026
          </div>

          {/* Titre */}
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6"
              style={{letterSpacing:'-0.03em'}}>
            Générez et gérez vos<br/>
            <span className="text-transparent bg-clip-text"
                  style={{backgroundImage:'linear-gradient(135deg, #185FA5, #378ADD)'}}>
              codes-barres
            </span>
            {' '}avec précision
          </h1>

          <p className="text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Une application web complète pour les PME camerounaises — créez, imprimez
            et suivez vos codes-barres EAN-13, QR Code et Code 128 avec une gestion
            des stocks en temps réel.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => navigate('/login')}
                    className="flex items-center gap-2 px-8 py-4 bg-primary-600
                               hover:bg-primary-700 text-white font-bold rounded-2xl
                               transition-all shadow-lg hover:shadow-xl text-sm">
              <Zap size={16}/>
              Accéder à l'application
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-white
                               hover:bg-slate-50 text-slate-700 font-medium
                               rounded-2xl border border-slate-200 transition-all text-sm
                               shadow-sm hover:shadow-md">
              <Globe size={16}/>
              Voir la documentation
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 lg:gap-16 mt-16
                          pt-10 border-t border-slate-200 flex-wrap">
            {stats.map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-primary-600">{val}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MOCKUP (aperçu de l'application)
      ══════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">

            {/* Barre du navigateur */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500"/>
              <div className="w-3 h-3 rounded-full bg-yellow-500"/>
              <div className="w-3 h-3 rounded-full bg-green-500"/>
              <div className="flex-1 mx-4 bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400">
                127.0.0.1:3000/dashboard
              </div>
            </div>

            {/* Contenu de l'app */}
            <div className="flex h-64">
              {/* Sidebar */}
              <div className="w-44 bg-primary-900 flex-shrink-0 p-3">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center">
                    <ScanBarcode size={12} className="text-white"/>
                  </div>
                  <span className="text-white text-xs font-bold">GestionCodes</span>
                </div>
                {[
                  ['📊','Tableau de bord', true ],
                  ['📦','Produits',        false],
                  ['🔲','Codes-barres',    false],
                  ['🖨️','Impressions',     false],
                  ['📈','Mouvements',      false],
                ].map(([emoji, label, active]) => (
                  <div key={label}
                       className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-xs
                                   ${active ? 'bg-white/20 text-white font-semibold' : 'text-white/50'}`}>
                    <span>{emoji}</span>{label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 bg-slate-50 p-4">
                {/* KPIs */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    ['248','Produits',       'border-l-blue-500'  ],
                    ['3',  'Ruptures',       'border-l-red-500'   ],
                    ['1204','Codes générés', 'border-l-green-500' ],
                    ['57', 'Scans',          'border-l-orange-500'],
                  ].map(([val, label, border]) => (
                    <div key={label}
                         className={`bg-white rounded-xl p-2.5 border-l-2 ${border} shadow-sm`}>
                      <p className="text-[9px] text-slate-400 font-medium">{label}</p>
                      <p className="text-lg font-bold text-slate-800">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Mini tableau */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="grid grid-cols-5 bg-slate-50 px-3 py-1.5 text-[8px]
                                  font-bold text-slate-400 uppercase border-b border-slate-100">
                    {['Produit','Réf.','Prix','Qté','État'].map(h => (
                      <span key={h}>{h}</span>
                    ))}
                  </div>
                  {[
                    ['Lait entier 1L',   'ALI-001','500 F',  '120','✅'],
                    ['Paracétamol 500mg','PHA-001','800 F',  '4',  '⚠️'],
                    ['Câble USB-C 2m',   'ELC-001','2500 F', '0',  '🔴'],
                    ['Sucre blanc 1kg',  'ALI-002','750 F',  '200','✅'],
                  ].map(([nom, ref, prix, qte, etat]) => (
                    <div key={nom}
                         className="grid grid-cols-5 px-3 py-1.5 text-[8px] text-slate-700
                                    border-b border-slate-50 last:border-0">
                      <span className="font-medium truncate">{nom}</span>
                      <span className="text-blue-600 font-mono">{ref}</span>
                      <span>{prix}</span>
                      <span className="font-bold">{qte}</span>
                      <span>{etat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            Aperçu de l'interface — Tableau de bord avec indicateurs temps réel
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FONCTIONNALITÉS
      ══════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-3">
              Fonctionnalités
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4"
                style={{letterSpacing:'-0.02em'}}>
              Tout ce dont votre PME a besoin
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              De la génération de codes à la gestion des stocks,
              chaque module simplifie vos opérations quotidiennes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, couleur, titre, desc, tags }) => {
              const c = couleurs[couleur] || couleurs.blue;
              return (
                <div key={titre}
                     className={`bg-white border ${c.border} rounded-2xl p-6
                                 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                  <div className={`${c.bg} w-12 h-12 rounded-2xl flex items-center
                                   justify-center mb-5`}>
                    <Icon className={`w-6 h-6 ${c.icon}`}/>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{titre}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(t => (
                      <span key={t}
                            className="text-[10px] font-semibold px-2.5 py-1
                                       bg-slate-100 text-slate-600 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ARCHITECTURE
      ══════════════════════════════════════════════════════ */}
      {/*<section className="px-6 lg:px-12 py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">
              Architecture
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4"
                style={{letterSpacing:'-0.02em'}}>
              3-tiers · REST API · MVC
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              React consomme l'API Laravel via des requêtes REST sécurisées.
              Chaque couche est indépendante et maintenable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 rounded-2xl overflow-hidden
                          border border-white/10">
            {[
              {
                num:'01', label:'Présentation',
                title:'Frontend React',
                desc:"Interface moderne avec React 18 + Vite. Consomme l'API via Axios avec tokens Bearer.",
                tech:['React 18','Vite','Tailwind CSS','Recharts','Axios','Lucide'],
              },
              {
                num:'02', label:'Logique métier',
                title:'API Laravel 13',
                desc:'9 contrôleurs REST, validation, gestion exceptions, génération codes-barres.',
                tech:['Laravel 13','PHP 8.3','Sanctum','Picqer','Endroid QR'],
              },
              {
                num:'03', label:'Données',
                title:'MySQL + Eloquent',
                desc:'9 tables relationnelles avec clés étrangères, migrations et seeders complets.',
                tech:['MySQL','Eloquent ORM','Migrations','9 tables'],
              },
            ].map(({ num, label, title, desc, tech }) => (
              <div key={num} className="bg-slate-800/50 p-8 border-r border-white/5 last:border-0">
                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">
                  {num} — {label}
                </p>
                <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tech.map(t => (
                    <span key={t}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg
                                     bg-white/5 text-slate-400 border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* ══════════════════════════════════════════════════════
          RÔLES
      ══════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 py-20 bg-slate-50"style={{background:'linear-gradient(135deg, #042C53 0%, #0C447C 50%, #185FA5 100%)'}}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-white/80 mb-3 uppercase tracking-widest ">
              Gestion des accès
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4"
                style={{letterSpacing:'-0.02em'}}>
              3 profils utilisateurs
            </h2>
            <p className="text-white/60 max-w-md mx-auto">
              Contrôle d'accès basé sur les rôles (RBAC) pour sécuriser chaque fonctionnalité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roles.map(({ titre, emoji, bg, border, text, perms }) => (
              <div key={titre} className={`${bg} border ${border} rounded-2xl p-6`}>
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className={`text-lg font-bold ${text} mb-3`}>{titre}</h3>
                <ul className="space-y-2.5">
                  {perms.map(p => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 size={15} className={`${text} flex-shrink-0 mt-0.5`}/>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STACK TECHNIQUE
      ══════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 py-16 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
            Stack technique
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {stack.map(({ nom, emoji }) => (
              <span key={nom}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50
                               border border-slate-200 rounded-full text-sm font-semibold
                               text-slate-700 hover:border-primary-400 hover:text-primary-800
                               hover:bg-primary-50 transition-all cursor-default">
                <span>{emoji}</span>{nom}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SÉCURITÉ
      ══════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 py-12 bg-primary-50 border-y border-primary-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-2xl">
                <Lock className="w-8 h-8 text-primary-600"/>
              </div>
              <div>
                <h3 className="font-bold text-primary-900 text-lg">Sécurité renforcée</h3>
                <p className="text-primary-700/70 text-sm">
                  Authentification Sanctum · Mots de passe hachés bcrypt ·
                  CORS configuré · Tokens Bearer JWT
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {['Sanctum Auth','bcrypt Hash','CORS','Bearer Token'].map(t => (
                <span key={t}
                      className="px-3 py-1.5 bg-white border border-primary-200
                                 text-primary-700 text-xs font-semibold rounded-full">
                  ✓ {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 py-24 text-center"
               style={{background:'linear-gradient(135deg, #042C53 0%, #0C447C 50%, #185FA5 100%)'}}>
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6"
              style={{letterSpacing:'-0.02em'}}>
            Prêt à démarrer ?
          </h2>
          <p className="text-white/60 max-w-lg mx-auto mb-10 leading-relaxed text-lg">
            Connectez-vous et commencez à générer vos premiers codes-barres
            en quelques secondes.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => navigate('/login')}
                    className="flex items-center gap-2 px-8 py-4 bg-white text-primary-800
                               font-bold rounded-2xl text-sm hover:bg-primary-50
                               transition-all shadow-lg hover:shadow-xl">
              <Zap size={16}/>
              Accéder à l'application
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-transparent
                               border border-white/30 text-white font-medium
                               rounded-2xl text-sm hover:bg-white/10 transition-all">
              <Globe size={16}/>
              Documentation API
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="bg-slate-900 px-6 lg:px-12 py-14">
        <div className="max-w-5xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary-600 p-1.5 rounded-lg">
                  <ScanBarcode className="w-4 h-4 text-white"/>
                </div>
                <span className="text-white font-bold text-sm">GestionCodes</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Application web de génération et gestion de codes-barres pour PME.
                Développée dans le cadre d'un projet académique de Génie Logiciel.
              </p>
            </div>

            {[
              {
                titre:'Application',
                liens:['Tableau de bord','Produits','Codes-barres','Stocks','Rapports'],
              },
              {
                titre:'Fonctionnalités',
                liens:['Génération EAN-13','QR Code intelligent','Impression étiquettes','Scan produits','Alertes stocks'],
              },
              {
                titre:'Technique',
                liens:['API REST Laravel 13','Frontend React + Vite','Base MySQL','Auth Sanctum','Architecture 3-tiers'],
              },
            ].map(({ titre, liens }) => (
              <div key={titre}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                  {titre}
                </p>
                {liens.map(l => (
                  <p key={l}
                     className="text-slate-500 hover:text-white text-xs mb-2
                                cursor-pointer transition-colors leading-relaxed">
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Ligne du bas */}
          <div className="border-t border-white/5 pt-8 flex items-center
                          justify-between flex-wrap gap-4">
            <p className="text-slate-600 text-xs">
              © 2026 GestionCodes — Tous droits réservés.
              Projet académique de Génie Logiciel.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['Laravel 13','React 18','PHP 8.3','MySQL','Sanctum'].map(t => (
                <span key={t}
                      className="text-[10px] px-2.5 py-1 border border-white/10
                                 text-slate-600 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
