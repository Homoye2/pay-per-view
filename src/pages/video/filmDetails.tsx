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
    prix: number;
    videoUrl: string;
    courteDescription: string;
    description: string;
    categorie: string;
    auteur: string;
    dure: string;
    pathImage: string;
    annee: string;
    type: string;
}

interface Streaming {
    id: number;
    videoID: number;
    videoData: string;
}

const FilmDescription: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [film, setFilm] = useState<Film | null>(null);
    const [streamingFilm, setStreamingFilm] = useState<Streaming | null>(null);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFilm = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/video/${id}`);
                console.log('Film data:', response.data); // Debugging line
                setFilm(response.data);
            } catch (error) {
                console.error('Error fetching film:', error);
                setError('Error fetching film data');
            }
        };
        fetchFilm();
    }, [id]);

    useEffect(() => {
        const fetchStreamingFilm = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/services-streaming/${id}`);
                console.log('Streaming film data:', response.data); // Debugging line
                setStreamingFilm(response.data);
            } catch (error) {
                console.error('Error fetching streaming film:', error);
                setError('Error fetching streaming film data');
            }
        };
        fetchStreamingFilm();
    }, [id]);

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
        <ReactPlayer url={`http://localhost:8000/storage/${streamingFilm.videoData}`} controls />,
        // Add other players here if needed
    ];

    return (
        <Box p={2}>
            <Box display="flex" gap="16px" flexWrap="wrap" mb={2}>
                <Button variant="contained" color="primary" onClick={() => navigate(`${paths.film}`) } style={{ borderRadius: '22px' }}>
                    Retour
                </Button>
            </Box>
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
            <Paper elevation={3} style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
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
                        <span style={{ marginRight: '16px' }}> {film.annee}</span>
                        <span >Dure:</span>
                        <span style={{ marginRight: '16px' }}> {film.dure}</span>
                        <span >Categorie:</span>
                        <span style={{ marginRight: '16px' }}> {film.type}</span>
                        <span >Prix:</span>
                        <span style={{ marginRight: '16px' }}> {film.prix} fcfa </span>
                    </Typography>
                    <Typography variant="body1" >
                        Auteur: {film.auteur}
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
