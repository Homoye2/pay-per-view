export const rootPaths = {
  root: '/',
  pagesRoot: 'pages',
  accueilRoot: 'Accueil',
  dashboardRoot:'dashboard',
  authRoot: 'authentication',
  
  errorRoot: 'error',
};

export default {

  dashboard :`/${rootPaths.dashboardRoot}`,
  profile: `/${rootPaths.dashboardRoot}/profile`,

  accueil: `/${rootPaths.accueilRoot}`,
  mesachats: `/${rootPaths.accueilRoot}/mes-achats`,
  mestransaction: `/${rootPaths.accueilRoot}/mes-transaction`,
  interfaceEvenement: `/${rootPaths.accueilRoot}/evenement-cours`,
  lecteurEvenement: `/${rootPaths.accueilRoot}/evenement-details`,
  lecteurFilm: `/${rootPaths.accueilRoot}/film-details`,
  lecteurSerie: `/${rootPaths.accueilRoot}/serie-details`,
  interfaceSerie: `/${rootPaths.accueilRoot}/Serie`,
  interfaceFilm: `/${rootPaths.accueilRoot}/Film`,


  serie: `/${rootPaths.dashboardRoot}/serie`,
  serieEpisode: `/${rootPaths.dashboardRoot}/serie-episode`,
  serieDetails: `/${rootPaths.dashboardRoot}/serie-details`,
  film: `/${rootPaths.dashboardRoot}/film`,
  filmDetail: `/${rootPaths.dashboardRoot}/film-details`,
  evenement: `/${rootPaths.dashboardRoot}/evenement`,
  evenementDetail: `/${rootPaths.dashboardRoot}/evenement-details`,

  allutilisateur: `/${rootPaths.dashboardRoot}/all-utilisateurs`,
  utilisateur: `/${rootPaths.dashboardRoot}/utilisateur`,
  create_utilisateur: `/${rootPaths.dashboardRoot}/create-utilisateur`,

  transaction: `/${rootPaths.dashboardRoot}/all-transaction`,

  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  resetPassword: `/${rootPaths.authRoot}reset-password`,
  comingSoon: `/coming-soon`,
  unauthorized: `/${rootPaths.errorRoot}/404`,
};
