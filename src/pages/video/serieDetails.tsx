import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';

interface Film {
    id: number;
    titre: string;
    videoUrl: string;
    videoID:number;
    courteDescription:string;
    description: string;
    dure: string;
    pathImage: string;
}
interface Serie {
    id: number;
    titre: string;
    prix: number;
    videoUrl: string;
    courteDescription: string;
    description: string;
    type: string;
    auteur: string;
    pathImage: string;
    annee: string;
    statut: string;
  }

interface Streaming {
  id: number;
  videoID: number;
  videoData: string;
}

const FilmDescription: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { videoID } = useParams<{ videoID: string }>();
  const { episode } = useParams<{ episode: string }>();
  const [streamingFilm, setStreamingFilm] = useState<Streaming | null>(null);
  const [film, setFilm] = useState<Film | null>(null);
  const [serie, setSerie] = useState<Serie | null>(null);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilm = async () => {
      try {

        const response = await axios.get(`http://localhost:8000/api/serie/${id}`);

        setFilm(response.data);
      } catch (error) {
        console.error('Error fetching film:', error);
        setError('Error fetching film data');
      }
    };
    fetchFilm();
  }, [id]);
  useEffect(() => {
    const fetchVideo = async () => {
      try {

        const response = await axios.get(`http://localhost:8000/api/video/${videoID}`);

        setSerie(response.data);
      } catch (error) {
        console.error('Error fetching film:', error);
        setError('Error fetching film data');
      }
    };
    fetchVideo();
  }, [videoID]);

  useEffect(() => {
    const fetchStreamingFilm = async () => {
      try {
       console.log(episode);
        const response = await axios.get(`http://localhost:8000/api/services-streaming/${episode}/${videoID}`);
         // Debugging line
        setStreamingFilm(response.data);
      } catch (error) {
        console.error('Error fetching streaming film:', error);
        setError('Error fetching streaming film data');
      }
    };
    fetchStreamingFilm();
  }, [videoID]);

  const handlePlayerChange = (index: number) => {
    setPlayerIndex(index);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!film || !streamingFilm) {
    return <Typography>Loading...</Typography>;
  }

  const playerComponents = [
    <ReactPlayer url={`http://localhost:8000/storage/${streamingFilm.videoData}`}  controls/>,
    // Add other players here if needed
  ];

  return (
    <Box p={2}>
    <Box display="flex" gap="16px" flexWrap="wrap" mb={2}>
            <Button variant="contained" color="primary" onClick={() => navigate(`${paths.serieEpisode}/${videoID}`) } style={{ borderRadius: '22px' }}>
                Retour
            </Button>
        </Box>
      <Typography variant="h4" component="h1" gutterBottom align="center" style={{ color: 'blue' }}>
        {film.titre}
      </Typography>
      <Divider />
      <Box display="flex" justifyContent="center" mb={2}>
        <Button variant="contained" color="primary" onClick={() => handlePlayerChange(0)}>
          ReactPlayer
        </Button>
        {/* Add other player buttons here if needed */}
      </Box>
      <Box display="flex" gap="16px" flexWrap="wrap" justifyContent="center" mb={2}>
        {playerComponents[playerIndex]}
      </Box>
      <Paper elevation={3} style={{ padding: '16px', display: 'flex', alignItems: 'center'}}>
        <img
          src={`http://localhost:8000/storage/${film.pathImage}`}
          alt={film.titre}
          style={{ width: '20%', height: 'auto', marginRight: '16px' }}
        />
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography variant="body1" style={{ color: 'red' }}>
            Titre: {film.titre}
          </Typography>
          <Typography variant="body1">
            <span >Annee:</span>
            <span style={{ marginRight: '16px' }}>{serie?.annee} </span>
            <span >Dure:</span>
            <span style={{ marginRight: '16px'  }}> {film.dure}</span>
            <span>Categorie:</span>
            <span style={{ marginRight: '16px' }}> {serie?.type}</span>
            <span >Prix:</span>
            <span style={{ marginRight: '16px' }}> {serie?.prix} fcfa </span>
          </Typography>
          <Typography variant="body1" >
            Auteur: {serie?.auteur}
          </Typography>
          <Typography variant="body1" style={{ color: 'white' }}>
            Description: {film.description}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default FilmDescription;
