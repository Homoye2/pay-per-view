import React, { useEffect, useState } from 'react';
import {
  AppBar, ButtonBase, Avatar, Box, Toolbar, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import IconifyIcon from 'components/base/IconifyIcon';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import paths from 'routes/paths';
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { Movie as LiveIcon, PlaylistAdd as PlayListIcon, Home as HomeIcon, TrendingDown as TranscribeIcon } from '@mui/icons-material';
interface User {
    id: string;
    nom: string;
    prenom: string;
    pathImage: string;
    email: string;
    photo?: string;
    password: string;
    contact: string;
    date: string;
    pays: string;
  }
  interface Video {
    id: number;
    titre: string;
    prix: number;
    videoUrl: string;
    courteDescription: string;
    description: string;
    categorie: string;
    auteur: string;
    dure: string;
    type: string;
    heureDebut: string;
    heureFin: string;
    pathImage: string;
    annee: string;
    date: string;
    statut: string;
  }
  interface Notification {
    id: number;
    type: string;
    data: string;
    read_at: string | null;
}

const Header: React.FC = () => {
  const [anchorElFilm, setAnchorElFilm] = React.useState<null | HTMLElement>(null);
  const [anchorElSerie, setAnchorElSerie] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [films, setFilms] = useState<Video[]>([]);
  const [series, setSeries] = useState<Video[]>([]);
  const [anneeFilms, setAnneeFilms] = useState<Video[]>([]);
  const [anneeSeries, setAnneeSeries] = useState <Video[]>([]);
  const [user, setUser] = useState<User | null>( null);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [notifications, setNotifications] =useState<Notification[]>([]);
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const [userInfoAll, setUserInfoAll] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  useEffect(() => {
    if (user?.email) {
      handleGetUser(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    // Remplacez cette URL par celle de votre API
    if (user && user.id) {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/notifications/unread/${user.id}`, {

        });
        setNotifications(response.data);
        //console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    };

    fetchNotifications();
   }
  }, [user]);
  const fetchFilms = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categorie/film');
      setFilms(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
    }
  };
  const markAllNotificationsAsRead = async (userId: string) => {
    try {
      // Boucle à travers toutes les notifications et marquez-les comme lues
      await Promise.all(notifications.map(notification =>
        axios.post(`http://localhost:8000/api/notifications/read/${notification.id}/${userId}`)
      ));

      // Mettez à jour l'état local pour refléter les notifications lues
      setNotifications(notifications.map(notification => ({
        ...notification,
        read_at: new Date().toISOString()
      })));

      // Optionnel : Fermez la fenêtre des notifications ou rafraîchissez les données
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications :', error);
    }
  };
  const handleMarkAllNotificationsAsRead = async () => {
    if (user) {
      await markAllNotificationsAsRead(user.id);
      setOpenNotificationsModal(false);  // Fermez la modal une fois les notifications marquées comme lues
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categorie/serie');
      setSeries(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des séries:', error);
    }
  };

  const fetchAnneeFilm = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/annee/film');
      setAnneeFilms(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
    }
  };
  const handleGetUser = async (email: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/utilisateur-email/${email}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setUserInfoAll(response.data);
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };


  const fetchAnneeSerie = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/annee/serie');
      setAnneeSeries(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
    }
  };

  useEffect(() => {
    fetchFilms();
    fetchSeries();
    fetchAnneeFilm();
    fetchAnneeSerie();
  }, []);

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCloseFilm = () => {
    setAnchorElFilm(null);
  };

  const handleCloseSerie = () => {
    setAnchorElSerie(null);
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <List>
      <ListItem button component={Link} to={paths.accueil} onClick={toggleDrawer(false)}>
        <HomeIcon sx={{ marginRight: 2 }} />
        <ListItemText primary="Accueil" />
      </ListItem>
      <ListItem button component={Link} to={paths.interfaceFilm} onClick={toggleDrawer(false)}>
        <LiveIcon sx={{ marginRight: 2 }} />
        <ListItemText primary="Films" />
      </ListItem>
      <ListItem button component={Link} to={paths.interfaceSerie} onClick={toggleDrawer(false)}>
        <LiveIcon sx={{ marginRight: 2 }} />
        <ListItemText primary="Séries" />
      </ListItem>
      <ListItem button component={Link} to={paths.interfaceEvenement} onClick={toggleDrawer(false)}>
        <LiveIcon sx={{ marginRight: 2 }} />
        <ListItemText primary="Événements" />
      </ListItem>
      <ListItem button component={Link} to={paths.mesachats} onClick={toggleDrawer(false)}>
        <PlayListIcon sx={{ marginRight: 2 }} />
        <ListItemText primary="Mes Achats" />
      </ListItem>
      <ListItem button component={Link} to={paths.mestransaction} onClick={toggleDrawer(false)}>
        <TranscribeIcon sx={{ marginRight: 2 }} />
        <ListItemText primary="Transactions" />
      </ListItem>
    </List>
  );

  return (
    <>
      <AppBar
        color="inherit"
        position="fixed"
        sx={{
          height: { xs: '10%', sm: '70px' },
          maxWidth: '100%',
          margin: 0,
          padding: { xs: '8px 16px', sm: '0 24px' },
          zIndex: 1,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button color="inherit" component={Link} to={paths.accueil}>Accueil</Button>
              <Button color="inherit" component={Link} to={paths.interfaceFilm}>Films</Button>
              <Button color="inherit" component={Link} to={paths.interfaceSerie}>Séries</Button>
              <Button color="inherit" component={Link} to={paths.interfaceEvenement}>Événements</Button>
              <Button color="inherit" component={Link} to={paths.mesachats}>Mes Achats</Button>
              <Button color="inherit" component={Link} to={paths.mestransaction}>Transactions</Button>
            </Box>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton size="large" sx={{ color: 'text.secondary' }} onClick={() => setOpenNotificationsModal(true)}>
                 <Badge badgeContent={notifications.length} color="error" >
                    <IconifyIcon icon="ion:notifications" />
                 </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Profile">
              <ButtonBase disableRipple onClick={() => setOpenDialog(true)}>
                <Avatar
                  src={`http://localhost:8000/storage/${userInfoAll?.pathImage}` || 'path/to/default/avatar.png'}
                  sx={{ height: 32, width: 32, bgcolor: 'primary.main' }}
                />
                <Typography variant="subtitle2" sx={{ ml: 2 }}>
                  {userInfoAll?.nom || 'Guest'}
                </Typography>
              </ButtonBase>
            </Tooltip>
          </Box>
        </Toolbar>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Voulez-vous vous déconnectez ?</DialogTitle>
          <DialogContent />
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Annuler
            </Button>
            <Button onClick={() => handleLogout()} color="primary">
              Déconnection
            </Button>
          </DialogActions>
        </Dialog>
      </AppBar>
      <Dialog open={openNotificationsModal} onClose={() => setOpenNotificationsModal(false)}>
          <DialogTitle>Notifications</DialogTitle>
          <DialogContent>
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box key={notification.id} sx={{ marginBottom: 2 }}>
                  <Typography variant="body1" >
                    <IconifyIcon icon="ion:notifications" />
                    {notification.type} : {notification.data}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {notification.read_at ? 'Lue' : 'Non lue'}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography > <IconifyIcon icon="ion:notifications" /> Aucune notification disponible.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMarkAllNotificationsAsRead} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
      <Menu
        anchorEl={anchorElFilm}
        keepMounted
        open={Boolean(anchorElFilm)}
        onClose={handleCloseFilm}
      >
        <MenuItem onClick={handleCloseFilm}>Tous les films</MenuItem>
        {films.map((film, index) => (
          <MenuItem key={index} onClick={handleCloseFilm}>
            {film.titre}
          </MenuItem>
        ))}
        <Divider />
        {anneeFilms.map((film, index) => (
          <MenuItem key={index} onClick={handleCloseFilm}>
            {film.annee}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={anchorElSerie}
        keepMounted
        open={Boolean(anchorElSerie)}
        onClose={handleCloseSerie}
      >
        <MenuItem onClick={handleCloseSerie}>Toutes les séries</MenuItem>
        {series.map((serie, index) => (
          <MenuItem key={index} onClick={handleCloseSerie}>
            {serie.titre}
          </MenuItem>
        ))}
        <Divider />
        {anneeSeries.map((serie, index) => (
          <MenuItem key={index} onClick={handleCloseSerie}>
            {serie.annee}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Header;
