import { Box, Typography,   InputAdornment, Modal,Link, Button ,Dialog, DialogTitle,Grid , DialogContent, DialogActions,TextField  } from '@mui/material';
import { useState, useEffect, } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia } from '@mui/material';

import IconifyIcon from 'components/base/IconifyIcon';

//import Header from './header';
import {  motion } from 'framer-motion';
import paths from 'routes/paths';
import { useNavigate } from 'react-router'


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
  heureDebut: string;
  heureFin: string;
  pathImage: string;
  type :string;
  saison :string;
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
  date: string;
  pays: string;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};


const InterfaceSerie = () => {
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
  const navigate = useNavigate();



  const fetchCountTransaction = async (videoID :  string) =>{
    try {
       const response = await axios.get(`http://localhost:8000/api/countOtransaction/${videoID}`);
       setCountTransaction(response.data);
    }catch(error){
        console.error('Erreur lors du chargement :', error);
    }
 }

  useEffect(() => {
    // Récupérer les données utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUsers(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
  const fetchFilms = async () => {
    try {
      const response = await axios.get<Video[]>('http://localhost:8000/api/video-categorie/serie');

        setFilms(response.data);
        setFilteredFilms(response.data);

    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
    }
  }
  fetchFilms();
}, []);





  useEffect(() => {
    if (users?.email) {
      handleGetUser(users.email);
    }
  }, [users?.email]);
  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return `${str.substring(0, maxLength)}...`;
    }
    return str;
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
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
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
      console.log(transactionExists);
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
  const filterVideos = (category: string) => {
    console.log(category);

    setFilteredFilms(films.filter(video => video.type === category));

  };

  const filterByYear = (year: string) => {

    setFilteredFilms(films.filter(video => video.annee === year));

  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredFilms = films.filter(video =>
      video.titre.toLowerCase().includes(searchValue) ||
      video.courteDescription.toLowerCase().includes(searchValue)
    );

    setFilteredFilms(filteredFilms);

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
              <Typography variant="h6" gutterBottom style={{ color: 'red' }}>
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
                    if (transactionExists) {
                      // Lancer l'action de visionnage ou autre
                      navigate(`${paths.lecteurSerie}/${selectedVideo.id}`);
                    } else {
                      // Ouvrir le dialogue d'achat
                      setOpenDialog(true);
                    }
                  }}

                >
                  {transactionExists ? 'Regarder' : 'Acheter'}
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
      <Grid container spacing={2}>
      <Grid item xs={12} md={3} >
      <Box sx={{ flex: { xs: '12', sm: '6' ,lg:'2' } , marginTop: 10,}}>
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

            <Box
                    sx={{
                    padding: 2,
                    borderRadius: '4px',
                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                    marginTop: 4,
                    }}
                >
            <Typography variant="h6" gutterBottom>
            Filtrer par Année
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
            {[
                 ['Fiction', 'Aventure', 'Guerre', 'Historique'],
                 [ 'Action', 'Comédie', 'Drame','Comédie dramatique'],
                 [ 'Fiction jeunesse', 'Film musical','Policier','espionnage'],
                 [ 'Science Fiction', 'fantastique','horreur','Dramatique']
            ].map((categorieGroup, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                {categorieGroup.map((categorie) => (
                    <Button
                    key={categorie}
                    variant="contained"
                    onClick={() => {
                        // Logique pour filtrer les vidéos par année
                        console.log(`Filtrer par année: ${categorie}`);
                        filterVideos(categorie);
                    }}
                    style={{fontSize:'10px'}}
                    >
                    {categorie}
                    </Button>
                ))}
                </Box>
             ))}
            </Box>
        </Box>
        <Box
            sx={{
            padding: 2,
            borderRadius: '4px',
            boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
            marginTop: 2,
            }}
        >
            <Typography variant="h6" gutterBottom>
            Filtrer par Année
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
                 ['2023', '2022', '2021', '2020'],
                 [ '2027', '2026', '2025','2024'],
                 [ '2031', '2030','2029','2028']
            ].map((yearGroup, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                {yearGroup.map((year) => (
                    <Button
                    key={year}
                    variant="contained"
                    onClick={() => {
                        // Logique pour filtrer les vidéos par année
                        console.log(`Filtrer par année: ${year}`);
                        filterByYear(year);
                    }}
                    >
                    {year}
                    </Button>
                ))}
                </Box>
             ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
        <Box id="films" sx={{ marginTop: 10}}>
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
          <Link href={paths.interfaceSerie} style={{ textDecoration: 'none' }}> Series </Link>
        </Typography>
        <Grid container spacing={1} justifyContent="center">
            {filteredFilms.map((video, index) => (
            <Grid item  key={`${video.id}-${index}`} xs={12} sm={6} md={4} lg={3} sx={{ marginBottom:2 ,marginTop:2}}>
               <Card  sx={{ width: 200, height: 270 }} >
                  <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover={{ scale: 1.1 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCardClick(video)}
                  >
                      <CardMedia
                      component="img"
                      height="140"
                      image={video.pathImage ? `http://localhost:8000/storage/${video.pathImage}` : 'https://via.placeholder.com/150'}
                      alt={video.titre}
                      />
                      <CardContent>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontSize: '12px' }}>
                          {video.titre}
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontSize: '12px' }}>
                         Saison {video.saison}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" style={{ fontSize: '10px' }}>
                      {truncateString(video.courteDescription,10)}
                      </Typography>
                      <Typography variant="body2" style={{ color: 'red' }}>
                          {video.prix} fcfa
                      </Typography>
                      </CardContent>

                  </motion.div>

                  </Card>
                </Grid>
             ))}
         </Grid>
        </Box>
        </Grid>

      </Grid>
    </Box>
  );
};

export default InterfaceSerie;
