/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import paths, { rootPaths } from './paths';
import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loading/Splash';
import PageLoader from 'components/loading/PageLoader';
//import ProtectedRoute from 'components/ProtectedRoute';
import Unauthorized from 'components/unauthorized';

// Lazy loading des pages
const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard'));
const Login = lazy(() => import('pages/authentication/Login'));
const Signup = lazy(() => import('pages/authentication/Signup'));
const ForgotPassword = lazy(() => import('pages/authentication/forgotpassword'));
const ResetPassword = lazy(() => import('pages/authentication/resetpassword'));
const Serie = lazy(() => import('pages/video/serie'));
const Evenement = lazy(() => import('pages/video/evenement'));
const SerieEpisode = lazy(() => import('pages/video/SerieEpisode'));
const Film = lazy(() => import('pages/video/film'));
const DetailsFilm = lazy(() => import('pages/video/filmDetails'));
const SerieDetails = lazy(() => import('pages/video/serieDetails'));
const EvenementDetails = lazy(() => import('pages/video/evenementDetails'));
const CreateUser = lazy(() => import('pages/utilisateur/create_utilisateur'));
const AllUsers = lazy(() => import('pages/utilisateur/allutilisateurs'));
const User = lazy(() => import('pages/utilisateur/utilisateur'));
const Profile = lazy(() => import('pages/utilisateur/profile'));
const Transaction = lazy(() => import('pages/transaction/transaction'));
const HomePage = lazy(() => import('layouts/interface-utilisateur'));
const MesAchats = lazy(() => import('layouts/interface-utilisateur/MesAchats'));
const MesTransactions = lazy(() => import('layouts/interface-utilisateur/MesTransaction'));
const InterfaceEvenement = lazy(() => import('layouts/interface-utilisateur/InterfaceEvenement'));
const InterfaceFilm = lazy(() => import('layouts/interface-utilisateur/InterfaceFilm'));
const InterfaceSerie = lazy(() => import('layouts/interface-utilisateur/InterfaceSerie'));
const EvenementLecteur = lazy(() => import('layouts/interface-utilisateur/EvenementLecteur'));
const FilmLecteur = lazy(() => import('layouts/interface-utilisateur/FilmLecteur'));
const SerieLecteur = lazy(() => import('layouts/interface-utilisateur/SerieLecteu'));
const Header = lazy(() => import('layouts/interface-utilisateur/header'));
const Footer = lazy(() => import('layouts/main-layout/Footer'));

// Routes protégées
const protectedRoutes = [
  {
    path: rootPaths.dashboardRoot,
    element:<MainLayout><Outlet /></MainLayout>,
    children: [
      { path: paths.serie, element: <Serie /> },
      { path: paths.film, element: <Film /> },
      { path: `${paths.filmDetail}/:id`, element: <DetailsFilm /> },
      { path: `${paths.serieEpisode}/:id`, element: <SerieEpisode /> },
      { path: `${paths.serieDetails}/:videoID/:episode/:id`, element: <SerieDetails /> },
      { path: paths.evenement, element: <Evenement /> },
      { path: `${paths.evenementDetail}/:id`, element: <EvenementDetails /> },
      { path: paths.profile, element: <Profile /> },
      { path: paths.dashboard, element: <Dashboard /> },
      { path: paths.allutilisateur, element: <AllUsers /> },
      { path: paths.create_utilisateur, element:<CreateUser /> },
      { path: `${paths.utilisateur}/:id`, element:<User /> },
      { path: paths.transaction, element:<Transaction />},
    ],
  },


  {
    path: rootPaths.accueilRoot,
    element: (<><Header /><Outlet /><Footer /> </>),
    children: [
      { path: paths.accueil, element: <HomePage /> },
      { path: paths.mesachats, element: <MesAchats /> },
      { path: paths.interfaceEvenement, element: <InterfaceEvenement /> },
      { path: paths.interfaceFilm, element: <InterfaceFilm /> },
      { path: paths.interfaceSerie, element: <InterfaceSerie /> },
      { path: `${paths.lecteurEvenement}/:id`, element: <EvenementLecteur /> },
      { path: `${paths.lecteurFilm}/:id`, element: <FilmLecteur /> },
      { path: `${paths.lecteurSerie}/:id`, element: <SerieLecteur /> },
      { path: paths.mestransaction, element: <MesTransactions /> },
    ],
  },
];

// Routes d'authentification
const authRoutes = [
  {
    path: rootPaths.authRoot,
    element: <AuthLayout><Outlet /></AuthLayout>,
    children: [
      { path: paths.signup, element: <Signup /> },
      { path: paths.forgotPassword, element: <ForgotPassword /> },
      { path: paths.resetPassword, element: <ResetPassword /> },
    ],
  },
];

// Routes de base
const baseRoutes = [
  {
    path: '/',
    element: <AuthLayout><Suspense fallback={<PageLoader />}><Login /></Suspense></AuthLayout>,
  },
  { path: paths.unauthorized, element: <Unauthorized /> },
];

// Création du routeur
const router = createBrowserRouter([
  {
    element: <Suspense fallback={<Splash />}><App /></Suspense>,
    children: [...baseRoutes, ...protectedRoutes, ...authRoutes],
  },
], {
  basename: '/',
});

export default router;
