import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  Box,
  Typography,
  Button,

} from '@mui/material';
import { useParams } from 'react-router';
import axios from 'axios';
import Paper from '@mui/material/Paper';

import paths from 'routes/paths';
import { useNavigate } from 'react-router';

interface Evenement {
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
  type: string;
  annee: string;
  date: string;
  statut: string;
}

const EvenementLecteur = () => {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveUrl = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/services-streaming/${id}`);
        const url = response.data.videoData;
        setLiveUrl(url);
      } catch (error) {
        console.error('Error fetching live URL:', error);
        setError('Error fetching live URL');
      }
    };

    fetchLiveUrl();
  }, [id]);

  useEffect(() => {
    const fetchEvenement = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/video/${id}`);
        setEvenement(response.data);
      } catch (error) {
        console.error('Error fetching event data:', error);
        setError('Error fetching event data');
      }
    };

    fetchEvenement();
  }, [id]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };





  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!evenement) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
        <Box display="flex" gap="16px" flexWrap="wrap" mb={2} sx={{ marginTop:10 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(`${paths.interfaceEvenement}`) } style={{ borderRadius: '60px' }}>
                Retour
            </Button>
        </Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginTop:5 }}>
        <Typography variant="h4" gutterBottom>Événement en Direct</Typography>

      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ReactPlayer
          url={liveUrl}
          playing={isPlaying}
          controls
          width="100%"
          height="100%"
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleStart}>Démarrer</Button>
        <Button variant="contained" color="secondary" onClick={handleStop}>Arrêter</Button>
      </Box>
      <Paper elevation={3} style={{ padding: '16px', display: 'flex', alignItems: 'center', margin: '20px' }}>
        <img
          src={`http://localhost:8000/storage/${evenement.pathImage}`}
          alt={evenement.titre}
          style={{ width: '20%', height: 'auto', marginRight: '16px' }}
        />
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography variant="body1" style={{ color: 'red' }}>
            Titre: {evenement.titre}
          </Typography>
          <Typography variant="body1">
            <span >Année :</span>
            <span style={{ marginRight: '16px' }}> {evenement.annee}</span>
            <span >Durée :</span>
            <span style={{ marginRight: '16px' }}> {evenement.dure}</span>
            <span >Catégorie :</span>
            <span style={{ marginRight: '16px' }}> {evenement.type}</span>
            <span >Prix :</span>
            <span style={{ marginRight: '16px' }}> {evenement.prix} fcfa</span>
          </Typography>
          <Typography variant="body1" >
          <span> Auteur : </span> {evenement.auteur}
          </Typography>
          <Typography variant="body1" style={{ color: 'white' }}>
          <span >  Description: </span> {evenement.description}
          </Typography>
        </Box>
      </Paper>

    </Box>
  );
};

export default EvenementLecteur;
