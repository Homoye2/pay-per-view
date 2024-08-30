import { Box, Typography, IconButton, Modal, Button } from '@mui/material';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import paths from 'routes/paths';
import { useNavigate } from 'react-router';

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

interface Transaction {
  id: number;
  utilisateur_id: number;
  video_id: number;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const VideoCategory = ({ title, videos, onVideoClick }: { title: string; videos: Video[]; onVideoClick: (video: Video) => void }) => {
  const [showArrows, setShowArrows] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [countTransaction, setCountTransaction] = useState<number |null>(null);
  const navigate = useNavigate();
  const checkOverflow = useCallback(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.parentElement?.offsetWidth || 0;
      const contentWidth = scrollRef.current.scrollWidth;
      setShowArrows(contentWidth > containerWidth);
    }
  }, [videos]);
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVideo(null);

  };
  const fetchCountTransaction = async (videoID :  string) =>{
    try {
       const response = await axios.get(`http://localhost:8000/api/countOtransaction/${videoID}`);
       setCountTransaction(response.data);
    }catch(error){
        console.error('Erreur lors du chargement :', error);
    }
 }
  const handleCardClick =  (video: Video) => {
    setSelectedVideo(video);
    fetchCountTransaction(video.id.toString())
    setOpenModal(true);
  };
  useEffect(() => {
    checkOverflow();
  }, [videos, checkOverflow]);
  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return `${str.substring(0, maxLength)}...`;
    }
    return str;
  };

  return (
    <Box id={title.toLowerCase()} sx={{ marginTop: 7 }}>
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
                Recommadation : {countTransaction}
              </Typography>
              <Typography variant="body2" gutterBottom >
                Prix : {selectedVideo.prix} fcfa
              </Typography>
              <Typography variant="body2" gutterBottom>
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
                    if ( selectedVideo.categorie==='evenement') {
                       navigate(`${paths.lecteurEvenement}/${selectedVideo.id}`);
                    } else if ( selectedVideo.categorie==='film') {
                       navigate(`${paths.lecteurFilm}/${selectedVideo.id}`);
                    }
                     else if ( selectedVideo.categorie==='serie') {
                       navigate(`${paths.lecteurSerie}/${selectedVideo.id}`);
                    }
                  }}
                >
                  Regarder
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
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
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {showArrows && (
          <IconButton
            sx={{ marginRight: 1 }}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollLeft -= 200;
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: 1,
          }}
        >
          {videos.map((video) => (
            <motion.div
              key={video.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.1 }}
              onClick={() => handleCardClick(video)}
            >
              <Card
                sx={{
                  width: 200,
                  margin: 1,
                  cursor: 'pointer',
                  height:270,

                }}
                onClick={() => onVideoClick(video)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:8000/storage/${video.pathImage}`}
                  alt={video.titre}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" style={{ fontSize:'10px' }}>
                    {video.titre}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div" style={{ fontSize:'10px' }}>
                  {truncateString(video.courteDescription,10)}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div" style={{ fontSize:'10px' ,color:'red' }}>
                    {video.prix} fcfa
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
        {showArrows && (
          <IconButton
            sx={{ marginLeft: 1 }}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollLeft += 200;
              }
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

const MesAchats = () => {
  const [films, setFilms] = useState<Video[]>([]);
  const [evenements, setEvenements] = useState<Video[]>([]);
  const [series, setSeries] = useState<Video[]>([]);

  const [userInfoAll, setUserInfoAll] = useState<User | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [transaction, setTransaction] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);

        if (user.email) {
          try {
            const response = await axios.get<User>(`http://localhost:8000/api/utilisateur-email/${user.email}`, {
              headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
              },
            });
            setUserInfoAll(response.data);
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evenementsResponse, filmsResponse, seriesResponse] = await Promise.all([
          axios.get<Video[]>('http://localhost:8000/api/video-categorie/evenement'),
          axios.get<Video[]>('http://localhost:8000/api/video-categorie/film'),
          axios.get<Video[]>('http://localhost:8000/api/video-categorie/serie'),
        ]);
        setEvenements(evenementsResponse.data);
        setFilms(filmsResponse.data);
        setSeries(seriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userInfoAll?.id) {
        try {
          const response = await axios.get<Transaction[]>(`http://localhost:8000/api/transactions-user/${userInfoAll.id}`, {
            headers: {
              'Content-Type': 'application/json',
              'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
          });
          setTransaction(response.data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      }
    };
    fetchTransactions();
  }, [userInfoAll?.id]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVideo(null);
  };

  const filterVideos = (videos: Video[]) => videos.filter(video => transaction.some(t => t.video_id === video.id));

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
                    maxHeight: '400px',
                    borderRadius: '5px',
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                {selectedVideo.titre}
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                {selectedVideo.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="contained" color="primary" onClick={handleCloseModal}>
                  Annuler
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCloseModal}>
                  Acheter
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <VideoCategory
        title="Événements"
        videos={filterVideos(evenements)}
        onVideoClick={setSelectedVideo}

      />
      <VideoCategory
        title="Films"
        videos={filterVideos(films)}
        onVideoClick={setSelectedVideo}
      />
      <VideoCategory
        title="Séries"
        videos={filterVideos(series)}
        onVideoClick={setSelectedVideo}
      />
    </Box>
  );
};

export default MesAchats;
