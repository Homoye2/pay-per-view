import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

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

const FilmCard = () => {
  const [films, setFilms] = useState<Video[]>([]);

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await axios.get<Video[]>('http://localhost:8000/api/video-categorie/film');
        setFilms(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      }
    };
    fetchEvenements();
  }, []);

  return (
    <>
      {films.map((film) => (
        <Card key={film.id} sx={{ maxWidth: 250, margin: 'auto' }} style={{ marginBottom: '20px' }}>
          <CardMedia
            component="img"
            height="50"
            width="50"
            image={`http://localhost:8000/storage/${film.pathImage}` || "https://via.placeholder.com/150"}
            alt={film.titre}
          />
          <CardContent>
            <Typography variant="h6">{film.titre}</Typography>
            <Typography variant="body2" color="textSecondary">
              {film.courteDescription}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {film.prix} fcfa
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default FilmCard;
