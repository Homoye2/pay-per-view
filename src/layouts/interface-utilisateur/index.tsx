import { Box, Typography, IconButton, Modal, Button ,Dialog, DialogTitle,Grid,InputAdornment , DialogContent, DialogActions,TextField  } from '@mui/material';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconifyIcon from 'components/base/IconifyIcon';
//import Header from './header';
import {  motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import paths from 'routes/paths';

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
  type :string;
  annee: string;
  saison: string;
  date: string;
  statut: string;
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


const HomePage = () => {
  const [films, setFilms] = useState<Video[]>([]);
  const [evenements, setEvenements] = useState<Video[]>([]);
  const [series, setSeries] = useState<Video[]>([]);
  const [users, setUsers] = useState<User | null>(null);
  const [userInfoAll, setUserInfoAll] = useState<User | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countTransaction, setCountTransaction] = useState<number |null>(null);
  const [transactionExists, setTransactionExists] = useState(false);

  const [showArrows, setShowArrows] = useState<{ [key: string]: boolean }>({
    evenements: false,
    films: false,
    series: false,
  });
  const [filteredEvenements, setFilteredEvenements] = useState<Video[]>([]);
  const [filteredFilms, setFilteredFilms] = useState<Video[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<Video[]>([]);
  const navigate = useNavigate();

 // const [searchTerm, setSearchTerm] = useState('');


  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkOverflow = useCallback(() => {
    if (containerRef.current && scrollRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = scrollRef.current.scrollWidth;
      setShowArrows({
        evenements: contentWidth > containerWidth,
        films: contentWidth > containerWidth,
        series: contentWidth > containerWidth,
      });
    }
  }, [evenements, films, series]);
  useEffect(() => {
    // Récupérer les données utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUsers(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        // Récupérer tous les événements
        const response = await axios.get<Evenement[]>('http://localhost:8000/api/evenements');

        // Définir la date du jour
        const today = new Date().toISOString().split('T')[0];

        // Filtrer les événements pour obtenir uniquement ceux du jour
        const todaysEvents = response.data.filter((e) => e.date === today);

        if (todaysEvents.length > 0) {
          // Récupérer les vidéos associées aux événements du jour
          const filmsResponse = await axios.get<Video[]>('http://localhost:8000/api/videoCategorie/evenement');

          // Associer les vidéos aux événements du jour
          const filmsWithDate = filmsResponse.data
            .filter((film) => todaysEvents.some((e) => e.videoID === film.id))
           .map((film) => {
              const event = todaysEvents.find((e) => e.videoID === film.id);
              return { ...film, date: event?.date || '' };
            });

          // Mettre à jour l'état avec les événements du jour et les vidéos associées
          setEvenements(filmsWithDate);
          setFilteredEvenements(filmsWithDate);
        } else {
          // Si aucun événement aujourd'hui, vider l'état
          setEvenements([]);
          setFilteredEvenements([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des films ou des événements:', error);
      }
    };

    fetchEvenements();
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
    const fetchFilms = async () => {
      try {
        const response = await axios.get<Video[]>('http://localhost:8000/api/videoCategorie/film');
        setFilms(response.data);
        setFilteredFilms(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      }
    };
    fetchFilms();
  }, []);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get<Video[]>('http://localhost:8000/api/videoCategorie/serie');
        setSeries(response.data);
        setFilteredSeries(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des séries:', error);
      }
    };
    fetchSeries();
  }, []);


  useEffect(() => {
    if (users?.email) {
      handleGetUser(users.email);
    }
  }, [users?.email]);

  useEffect(() => {
    // Call checkOverflow when data is loaded
    checkOverflow();
  }, [evenements, films, series, checkOverflow]);

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
      //console.log(transactionExists);
    }
    setSelectedVideo(video);
    fetchCountTransaction(video.id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVideo(null);
    setTransactionExists(false);
  };
  const filterVideos = (category: string) => {
    console.log(category);
    setFilteredEvenements(evenements.filter(video => video.type === category));
    setFilteredFilms(films.filter(video => video.type === category));
    setFilteredSeries(series.filter(video => video.type === category));
  };

  const filterByYear = (year: string) => {
    setFilteredEvenements(evenements.filter(video => video.annee === year));
    setFilteredFilms(films.filter(video => video.annee === year));
    setFilteredSeries(series.filter(video => video.annee === year));
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();


    const filteredEvenements = evenements.filter(video =>
      video.titre.toLowerCase().includes(searchValue) ||
      video.courteDescription.toLowerCase().includes(searchValue)
    );
    const filteredFilms = films.filter(video =>
      video.titre.toLowerCase().includes(searchValue) ||
      video.courteDescription.toLowerCase().includes(searchValue)
    );
    const filteredSeries = series.filter(video =>
      video.titre.toLowerCase().includes(searchValue) ||
      video.courteDescription.toLowerCase().includes(searchValue)
    );

    setFilteredEvenements(filteredEvenements);
    setFilteredFilms(filteredFilms);
    setFilteredSeries(filteredSeries);
  };

  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return `${str.substring(0, maxLength)}...`;
    }
    return str;
  };

  return (
    <Box sx={{ padding: 2 ,flex: { xs: '12', sm: '6' ,lg:'2' } }}>

      <Modal open={openModal}   onClose={handleCloseModal}>
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
            flex:{ xs: '12', sm: '6' ,lg:'2' }
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
                  flex: { xs: '12', sm: '6' ,lg:'2' }
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
                    maxHeight: '400px',
                    borderRadius: '5px',
                    objectFit: 'contain',

                  }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Titre : {selectedVideo.titre}
              </Typography>
              <Typography variant="h6" gutterBottom style={{ color: 'red' }}>
              Recommandation  :  {countTransaction}
              </Typography>

              <Typography variant="body2" gutterBottom >
                Prix : {selectedVideo.prix} fcfa
              </Typography>
              <Typography variant="body2" gutterBottom >
                Auteur : {selectedVideo.auteur}  {selectedVideo.categorie}
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
                    if (transactionExists || selectedVideo.type==='public') {
                        if(selectedVideo.categorie==='film'){
                            navigate(`${paths.lecteurFilm}/${selectedVideo.id}`);
                        }
                        else if(selectedVideo.categorie==='serie'){
                            navigate(`${paths.lecteurSerie}/${selectedVideo.id}`);
                        }
                        else if(selectedVideo.categorie==='evenement'){
                            navigate(`${paths.lecteurEvenement}/${selectedVideo.id}`);
                        }
                    } else {
                      // Ouvrir le dialogue d'achat
                      setOpenDialog(true);
                    }
                  }}

                >
                  {transactionExists || selectedVideo.type === 'public' ? 'Regarder' : 'Acheter'}
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
      <Grid item xs={12} md={3}>
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
            zIndex :-1,
            }}
        >
            <Typography variant="h6" gutterBottom>
            Filtrer par Année
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: { xs: '12', sm: '6' ,lg:'2' }}}>
            {[
                 ['Fiction', 'Aventure', 'Guerre', 'Historique'],
                 [ 'Action', 'Comédie', 'Drame','Comédie dramatique'],
                 [ 'Fiction jeunesse ', 'Film musical','Policier ','espionnage'],
                 [ 'Science Fiction', 'fantastique','horreur ','Dramatique']
            ].map((categorieGroup, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                {categorieGroup.map((categorie) => (
                    <Button
                    key={categorie}
                    variant="contained"
                    onClick={() => {
                        // Logique pour filtrer les vidéos par année
                        console.log(`Filtrer par Categorie: ${categorie}`);
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
            zIndex :1,
            }}
        >
            <Typography variant="h6" gutterBottom>
            Filtrer par Année
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 , flex: { xs: '12', sm: '6' ,lg:'2' } }}>
            {[
                 ['2023', '2022', '2021', '2000'],
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
      <Grid item xs={12} md={9} >
      <Box id="evenements" sx={{ marginTop: 10 ,flex: { xs: '12', sm: '12' ,lg:'12' }}}>
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
          Événements en Cours
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showArrows.filteredEvenements && (
            <IconButton onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              gap: '10px',
              padding: '10px',
              flex: { xs: '12', sm: '6' ,lg:'2' },

            }}
          >
            {filteredEvenements.map((video) => (
              <motion.div
                key={video.id}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                style={{ margin: '10px', cursor: 'pointer' }}
                onClick={() => handleCardClick(video)}
              >
                <Card sx={{ width: 200, height: 270  ,flex: { xs: '12', sm: '6' ,lg:'2' }, borderRadius: '10px'}}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      video.pathImage
                        ? `http://localhost:8000/storage/${video.pathImage}`
                        : 'https://via.placeholder.com/150'
                    }
                    alt={video.titre}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" style={{ fontSize: '12px' }}>
                      {video.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ fontSize: '10px' }}>
                      {truncateString(video.courteDescription,12)}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
          {showArrows.filteredEvenements && (
            <IconButton onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}>
              <ArrowForwardIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box id="films" sx={{ marginBottom: 4 }}>
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
            flex: { xs: '12', sm: '6' ,lg:'2' },

          }}
        >
          Films
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showArrows.filteredFilms && (
            <IconButton onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              gap: '10px',
              padding: '10px',

            }}
          >
            {filteredFilms.map((video) => (
              <motion.div
                key={video.id}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                style={{ margin: '10px', cursor: 'pointer' }}
                onClick={() => handleCardClick(video)}
              >
                <Card sx={{ width: 200, height: 270 , borderRadius: '10px'}}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      video.pathImage
                        ? `http://localhost:8000/storage/${video.pathImage}`
                        : 'https://via.placeholder.com/150'
                    }
                    alt={video.titre}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" style={{ fontSize: '12px' }}>
                      {video.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ fontSize: '10px' }}>
                      {truncateString(video.courteDescription,12)}
                    </Typography>
                    <Typography variant="body2" style={{ color:'red' }} >
                      {video.prix} fcfa
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
          {showArrows.filteredFilms && (
            <IconButton onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}>
              <ArrowForwardIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box id="series" sx={{ marginBottom: 4 }}>
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
          Séries
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showArrows.series && (
            <IconButton onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              gap: '10px',
              padding: '10px',

            }}
          >
            {filteredSeries.map((video) => (
              <motion.div
                key={video.id}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                style={{ margin: '10px', cursor: 'pointer' }}
                onClick={() => handleCardClick(video)}
              >
                <Card sx={{ width: 200, height: 270 , borderRadius: '10px'}}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      video.pathImage
                        ? `http://localhost:8000/storage/${video.pathImage}`
                        : 'https://via.placeholder.com/150'
                    }
                    alt={video.titre}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" style={{ fontSize: '12px' }}>
                      {video.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ fontSize: '10px' }}>
                      {truncateString(video.courteDescription,10)}
                    </Typography>
                    <Typography variant="body2"  >
                     Saison - {video.saison}
                    </Typography>
                    <Typography variant="body2" style={{ color:'red' }} >
                      {video.prix} fcfa
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
          {showArrows.filteredSeries && (
            <IconButton onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}>
              <ArrowForwardIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      </Grid>

      </Grid>
    </Box>
  );
};

export default HomePage;
