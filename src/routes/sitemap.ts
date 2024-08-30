import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Accueil',
    path: paths.dashboard, // Adjusting base path
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 'serie',
    subheader: 'Series',
    path: paths.serie,
    icon: 'mingcute:play-circle-fill',
    active: true,
  },
  {
    id: 'film',
    subheader: 'Films',
    path: `${paths.film}`,
    icon: 'mingcute:movie-fill',
    active: true,
  },
  {
    id: 'evenement',
    subheader: 'Evenements',
    path: paths.evenement,
    icon: 'mingcute:movie-fill',
    active: true,
  },
  {
    id: 'transaction',
    subheader: 'Transaction',
    path: paths.transaction,
    icon: 'mingcute:calendar-fill',
    active: true,
  },


  {
    id: 'authentication',
    subheader: 'Authentication',
    icon: 'mingcute:safe-lock-fill',
    active: true,
    items: [
      {
        name: 'Login',
        pathName: 'login',
        path:'/',
        active: true,
      },
      {
        name: 'Signup',
        pathName: 'signup',
        path: paths.signup,
        active: true,
      },
    ],
  },
  {
    id: 'user',
    subheader: 'Utilisateurs',
    icon: 'mingcute:user-2-fill',
    active: true,
    items: [
      {
        name: 'Creation Administrateur',
        pathName: 'create_user',
        path: paths.create_utilisateur,
        active: true,
      },
      {
        name: 'Listes Utilisateurs',
        pathName: 'liste_utilisateur',
        path: paths.allutilisateur,
        active: true,
      },
    ],
  },
];

export default sitemap;
