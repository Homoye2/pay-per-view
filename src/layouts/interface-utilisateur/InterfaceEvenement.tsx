import { Box, Typography, InputAdornment,Link, Modal, Button, Dialog, DialogTitle, Grid, DialogContent, DialogActions, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { motion } from 'framer-motion';
import paths from 'routes/paths';
import { useNavigate } from 'react-router';


interface Video {
  id: string;
  titre: string;
  prix: number;
  videoUrl: string;
  courteDescription: string;
  description: string;
  categorie: string;
  auteur: string;
  dure: string;
  heureDebut: string;
  heureFin: string;
  pathImage: string;
  type: string;
  annee: string;
  date: string;

  statut: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  password: string;
  contact: string;

  pays: string;
}
interface  Evenement{
    id : string;
    videoID:string;
    pathImage :string;
    categorie :string;
    date : string;
    heureDebut :string;
    heureFin :string;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const InterfaceEvenement = () => {
  const [films, setFilms] = useState<Video[]>([]);

  const [users, setUsers] = useState<User | null>(null);
  const [userInfoAll, setUserInfoAll] = useState<User | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionExists, setTransactionExists] = useState(false);
  const [filteredFilms, setFilteredFilms] = useState<Video[]>([]);
  const [countTransaction, setCountTransaction] = useState<number |null>(null);
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUsers(JSON.parse(userData));
    }
  }, []);
  const fetchCountTransaction = async (videoID :  string) =>{
    try {
       const response = await axios.get(`http://localhost:8000/api/countOtransaction/${videoID}`);
       setCountTransaction(response.data);
    }catch(error){
        console.error('Erreur lors du chargement :', error);
    }
 }

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await axios.get<Evenement[]>('http://localhost:8000/api/evenements');


        // Fetch films and map the event date
        const filmsResponse = await axios.get<Video[]>('http://localhost:8000/api/video-categorie/evenement');
        const filmsWithDate = filmsResponse.data.map((film) => {
          const event = response.data.find((e) => e.videoID === film.id);
          return {
            ...film,
            date: event?.date || '', // Assign the date from the event
          };
        });
        setFilms(filmsWithDate);
        setFilteredFilms(filmsWithDate);
      } catch (error) {
        console.error('Erreur lors de la récupération des films ou des événements:', error);
      }
    };
    fetchEvenements();
  }, []);

  useEffect(() => {
    if (users?.email) {
      handleGetUser(users.email);
    }
  }, [users?.email]);

  const handleGetUser = async (email: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/utilisateur-email/${email}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setUserInfoAll(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };
  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return `${str.substring(0, maxLength)}...`;
    }
    return str;
  };

  const checkTransaction = async (idUser: string, idVideo: string) => {
    try {
      const response = await axios.get<{ exists: boolean }>(`http://localhost:8000/api/TransactionUser/${idUser}/${idVideo}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setTransactionExists(response.data.exists);
    } catch (error) {
      console.error('Erreur lors de la vérification de la transaction:', error);
      setTransactionExists(false);
    }
  };

  const handleCardClick = async (video: Video) => {
    if (userInfoAll?.id) {
      await checkTransaction(userInfoAll.id, video.id.toString());
    }
    setSelectedVideo(video);
    fetchCountTransaction(video.id.toString());
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVideo(null);
    setTransactionExists(false);
  };



  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredFilms = films.filter(video =>
      video.titre.toLowerCase().includes(searchValue) ||
      video.courteDescription.toLowerCase().includes(searchValue)
    );
    setFilteredFilms(filteredFilms);
  };

  const filterCurrentEvents = () => {
    return films.filter(video => video.date === today);
  };

  const filterUpcomingEvents = () => {
    return films.filter(video => video.date > today);
  };

  const filterPastEvents = () => {
    return films.filter(video => video.date < today);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'black',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          {selectedVideo && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <img
                  src={
                    selectedVideo.pathImage
                      ? `http://localhost:8000/storage/${selectedVideo.pathImage}`
                      : 'https://via.placeholder.com/150'
                  }
                  alt={selectedVideo.titre}
                  style={{
                    width: '40%',
                    height: 'auto',
                    maxHeight: '250px',
                    borderRadius: '5px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Titre : {selectedVideo.titre}
              </Typography>
              <Typography variant="h6" gutterBottom style={{ color: 'red' }} >
                Recommadation : {countTransaction}
              </Typography>
              <Typography variant="body2" gutterBottom >
                Prix : {selectedVideo.prix} fcfa
              </Typography>
              <Typography variant="body2" gutterBottom >
                Auteur : {selectedVideo.auteur}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {selectedVideo.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCloseModal}
                  sx={{ flex: 1, marginRight: 1 }}
                >
                  Annuler
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ flex: 1, marginLeft: 1 }}
                  onClick={() => {
                    if (transactionExists || selectedVideo.type ==='public') {
                       navigate(`${paths.lecteurEvenement}/${selectedVideo.id}`);
                    } else {
                      // Ouvrir le dialogue d'achat
                      setOpenDialog(true);
                    }
                  }}
                >
                  {transactionExists || selectedVideo.type ==='public' ? 'Regarder' : 'Acheter'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Acheter</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="phoneNumber"
            label="Numéro de téléphone"
            type="text"
            fullWidth
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Annuler
          </Button>
          <Button
            onClick={() => {
              // Traitement à faire lors de l'achat
              console.log('Numéro de téléphone:', phoneNumber);
              setOpenDialog(false);
            }}
            color="primary"
          >
            Acheter
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} sx={{ marginTop:10 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ flex: { xs: '12', sm: '6', lg: '2' } }}>
            <TextField
              fullWidth
              label="Rechercher..."
              variant="outlined"
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconifyIcon icon="mdi:magnify" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button onClick={() => setFilteredFilms(filterCurrentEvents())}>Evènements en cours</Button>
          <Button onClick={() => setFilteredFilms(filterUpcomingEvents())}>Evènements à venir</Button>
          <Button onClick={() => setFilteredFilms(filterPastEvents())}>Evènements passés</Button>
        </Grid>
        <Grid item xs={12} md={9} >
        <Typography
            variant="h5"
            gutterBottom
            sx={{
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '4px',
            color: 'primary.main',
            backgroundClip: 'text',
            boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
            }}
        >
          <Link href={paths.interfaceEvenement} style={{ textDecoration: 'none' }}> Evenements </Link>
        </Typography>
        <Grid container spacing={1} justifyContent="center">
            {filteredFilms.map((video,index) => (
               <Grid item  key={`${video.id}-${index}`} xs={12} sm={6} md={4} lg={3} sx={{ marginBottom:2 ,marginTop:2}}>
               <Card  sx={{ width: 200, height: 270 , borderRadius: '10px'}} >
              <motion.div
                key={video.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.1 }}
                onClick={() => handleCardClick(video)}
              >

                  <CardMedia
                    component="img"
                    height="140"
                    image={video.pathImage ? `http://localhost:8000/storage/${video.pathImage}` : 'https://via.placeholder.com/150'}
                    alt={video.titre}
                    sx={{ borderRadius: '5px 5px 0 0' }}
                  />
                  <CardContent>
                    <Typography variant="h6" style={{ fontSize: 12 }}>{video.titre}</Typography>
                    <Typography variant="body2" color="text.secondary" style={{ fontSize: '10px' }}>
                    {truncateString(video.courteDescription,10)}
                      </Typography>

                  </CardContent>

              </motion.div>
              </Card>
            </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterfaceEvenement;
