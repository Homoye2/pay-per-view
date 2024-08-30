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
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';


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

interface Episode {
    id: number;
    titre: string;
    videoID: number;
    videoData: string;
    episode :string;
}

interface Streaming {
    id: number;
    videoID: number;
    videoData: string;
    episode :string;
}

const SerieLecteur: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [film, setFilm] = useState<Film | null>(null);
    const [streamingFilm, setStreamingFilm] = useState<Streaming | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [currentEpisode, setCurrentEpisode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFilm = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/video/${id}`);
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
                const response = await axios.get(`http://localhost:8000/api/services-streaming-all-video/${id}`);
                const data = response.data;

                if (Array.isArray(data) && data.length > 0) {
                    setStreamingFilm(data[0]);

                    setCurrentEpisode(data[0].videoData);
                } else if (data.videoData) {
                    setStreamingFilm(data);
                    setCurrentEpisode(data.videoData);
                } else {
                    setStreamingFilm(null);
                    setCurrentEpisode(null);
                }
            } catch (error) {
                console.error('Error fetching streaming film:', error);
                setError('Error fetching streaming film data');
            }
        };
        fetchStreamingFilm();
    }, [id]);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const fetchEpisodeData = await axios.get(`http://localhost:8000/api/serie/episode/${id}`);
                const response = await axios.get(`http://localhost:8000/api/services-streaming-all-video/${id}`);
                const episodeData = fetchEpisodeData.data;
                // Update each episode's videoData with streamingFilm.videoData if available
                if (streamingFilm) {
                    const updatedEpisodes = episodeData.map((episode: Episode) => {
                        const varVideo = response.data.find((e: Streaming) => e.episode === episode.episode && e.videoID === episode.videoID);
                        console.log(" Stream resp:" ,episodeData);
                        console.log(" resp:" ,response.data);
                        console.log(" var:" ,varVideo);
                        return {
                            ...episode,
                            videoData: varVideo?.videoData, // Corrected property name
                        };
                    });
                    setEpisodes(updatedEpisodes);
                } else {
                    setEpisodes(episodeData);
                }
            } catch (error) {
                console.error('Error fetching episodes:', error);
                setError('Error fetching episodes data');
            }
        };
        fetchEpisodes();
    }, [id, streamingFilm]);
    const handleEpisodeChange = (event: SelectChangeEvent<string>) => {
        const selectedVideoData = event.target.value;
        setCurrentEpisode(selectedVideoData);
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!film || !streamingFilm) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box p={2}>
            <Box display="flex" gap="16px" flexWrap="wrap" mb={2} sx={{ marginTop:10 }}>
                <Button variant="contained" color="primary" onClick={() => navigate(`${paths.interfaceSerie}`)} style={{ borderRadius: '22px' }}>
                    Retour
                </Button>
            </Box>
            <Divider />
            <Box display="flex" gap="16px" flexWrap="wrap">
                <Box flex={1}>
                    <Box display="flex" justifyContent="center" mb={2} gap={2}>
                        <Button variant="contained" color="primary">
                            ReactPlayer
                        </Button>
                        <Select
                        value={currentEpisode || ''}
                        onChange={handleEpisodeChange}
                        placeholder='Episode'
                        fullWidth
                        variant="outlined"
                        style={{width:'120px'}}
                        >
                        <MenuItem value="" disabled>
                                Episode
                        </MenuItem>
                        {episodes.map((episode) => (
                            <MenuItem key={episode.id} value={episode.videoData}>
                                Episode {episode.episode}
                            </MenuItem>
                        ))}
                    </Select>
                    </Box>
                    <Box display="flex" gap="16px" flexWrap="wrap" justifyContent="center" mb={2}>
                        <ReactPlayer url={`http://localhost:8000/storage/${currentEpisode}`} controls />
                    </Box>
                </Box>

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
                        <span>Annee:</span>
                        <span style={{ marginRight: '16px' }}> {film.annee}</span>
                        <span>Dure:</span>
                        <span style={{ marginRight: '16px' }}> {film.dure}</span>
                        <span>Categorie:</span>
                        <span style={{ marginRight: '16px' }}> {film.type}</span>
                        <span>Prix:</span>
                        <span style={{ marginRight: '16px' }}> {film.prix} fcfa </span>
                    </Typography>
                    <Typography variant="body1">
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

export default SerieLecteur;
