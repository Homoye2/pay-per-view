import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  InputAdornment, TextareaAutosize
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router';
//import Select, { StylesConfig, CSSObjectWithLabel, GroupBase } from 'react-select';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import { useParams } from 'react-router-dom';


interface Episode {
  id: number;
  titre: string;
  videoID: string;

  videoUrl: string;
  courteDescription: string;
  description: string;
  dure: string;
  pathImage: string;
  episode: number;
  statut: string;
}
interface Serie {
  id: number;
  titre: string;
  prix: number;
  videoUrl: string;
  courteDescription: string;
  description: string;
  categorie: string;
  saison: string;
  auteur: string;
  pathImage: string;
  annee: string;
  statut: string;
}



interface VideoDure {
    id: number;
    dure: number;
  }

const EpisodeList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const episodesPerPage = 10;
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [series, setSeries] = useState<Serie>();
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [videoDures, setVideoDures] = useState<{[key: number]: number }>([]);

  const [newEpisode, setNewEpisode] = useState<Partial<Episode>>({
    titre: '', episode: 0, videoUrl: '', courteDescription: '', dure: '', description: '',statut:'', pathImage: ''
  });

  const navigate = useNavigate();



    // Fetch film data (Replace with your own API call)
    const fetchEpisodes = async () => {
      const response = await axios.get<Episode[]>(`http://localhost:8000/api/serie/episode/${id}`);
      setEpisodes(response.data);
      console.log(response.data);

    };
    const fetchSeries = async () => {
      const response = await axios.get<Serie>(`http://localhost:8000/api/video/${id}`);
      setSeries(response.data);
      console.log(response.data);

    };
   useEffect(() => {
    // Fetch video durations
    const fetchVideoDures = async () => {
      const response = await axios.get<VideoDure[]>('http://localhost:8000/api/video-dure');
      const dureData = response.data.reduce<{ [key: number]: number }>((acc, video) => {
        acc[video.id] = video.dure;

        return acc;
      }, {});

      setVideoDures(dureData);
      console.log(setVideoDures(dureData));
      console.log(videoDures);
    };


    fetchEpisodes();
    fetchSeries();
    fetchVideoDures();

  }, []);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredEpisodes = episodes.filter(episode => episode.titre.toLowerCase().includes(search.toLowerCase()));
  const startIndex = (page - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = filteredEpisodes.slice(startIndex, endIndex);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewEpisode({ titre: '', videoUrl: '', courteDescription: '', dure: '',  description: '', statut:'', pathImage: '' });
  };

  const handleEditOpen = (serie: Episode) => {
    setCurrentEpisode(serie);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentEpisode(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEpisode({ ...newEpisode, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (currentEpisode) {
      const { name, value } = e.target;
      setCurrentEpisode({ ...currentEpisode, [name]: value });
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {

        setNewEpisode({ ...newEpisode, pathImage: file.name });
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleEditImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
    }
  };



  const durationToTime = (duration: string): string => {
    const match = duration.match(/^(\d*)h(\d*)mn(\d*)s$/)
                || duration.match(/^(\d+):(\d+):(\d+)$/)
                || duration.match(/^(\d*)h(\d*)mn$/)
                || duration.match(/^(\d+):(\d+)$/);

    if (match) {
      const [, hours = '0', minutes = '0', seconds = '0'] = match;
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }

    return '00:00:00';
  };
  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return `${str.substring(0, maxLength)}...`;
    }
    return str;
  };

  const handleAddSerie = async () => {
    if (video && image) {
      const formData = new FormData();
      formData.append('video', video);
      formData.append('videoID', series?.id.toString() || '');
      formData.append('titre', newEpisode.titre || '');
      formData.append('description', newEpisode.description || '');
      formData.append('pathImage', image);
      formData.append('categorie', 'serie');
      formData.append('courteDescription', newEpisode.courteDescription || '');
      formData.append('dure', durationToTime(newEpisode.dure || ''));

      console.log(formData);

      try {
        await axios.post('http://localhost:8000/api/serie/creat-episode', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        });
        fetchEpisodes();
        handleClose();
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  const handleEditEpisode = async () => {
    console.log("image:", image);
    console.log(video)
    if (currentEpisode && image && video) {
      const formData = new FormData();
      formData.append('video', video);
      formData.append('titre', currentEpisode.titre);
      formData.append('videoID', series?.id.toString() || '');
      formData.append('description', currentEpisode.description);
      formData.append('pathImage',image);
      formData.append('categorie', 'serie');
      formData.append('courteDescription', currentEpisode.courteDescription);
      formData.append('dure', durationToTime(currentEpisode.dure));

      console.log([...formData.entries()]);

      try {
        const response=await axios.post(`http://localhost:8000/api/update-serie-episode/${currentEpisode.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
         },

        });
        console.log(response.data);
        fetchEpisodes();
        handleEditClose();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Error details:', error.response.data);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    }
  };



  return (
    <Box p={3}>
    <Box display="flex" gap="16px" flexWrap="wrap" mb={2}>
        <Button variant="contained" color="primary" onClick={() => navigate(`${paths.serie}`) } style={{ borderRadius: '22px' }}>
            Retour
        </Button>
    </Box>
      <Typography variant="h4" gutterBottom>
        Listes Des Episodes De La Series : {series?.titre} - Saison {series?.saison}
      </Typography>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Rechercher une episode"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconifyIcon icon="mdi:magnify" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Ajouter Une Episode
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Episode</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentEpisodes.map((episode ) => (
              <TableRow key={episode.id}>
                <TableCell>{episode.id}</TableCell>
                <TableCell>{episode.titre}</TableCell>
                <TableCell>{episode.episode}</TableCell>
                <TableCell>{episode.dure}</TableCell>

                <TableCell >{truncateString(episode.courteDescription,22)}</TableCell>
                <TableCell >{episode.statut}</TableCell>
                <TableCell>
                     {episode.pathImage && (
                      <img src={`http://localhost:8000/storage/${episode.pathImage}`} alt={episode.titre} style={{ width: '50px', height: 'auto' }} />
                    )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`${paths.serieDetails}/${episode.videoID}/${episode.episode}/${episode.id}`)}
                    size="small"
                  >
                    <VisibilityIcon fontSize='small'  style={{ width :'12px'}}/>
                  </IconButton>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEditOpen(episode)}
                  >
                    <EditIcon fontSize='small'  style={{ width :'12px'}}/>
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={async () => {
                      try {
                        await axios.delete(`http://localhost:8000/api/serie-delete/${episode.id}`);
                        fetchEpisodes();
                      } catch (error) {
                        console.error('Error deleting film:', error);
                      }
                    }}
                      size="small"
                  >
                    <DeleteIcon fontSize='small'  style={{ width :'12px'}}/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredEpisodes.length / episodesPerPage)}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter Une Episode</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            name="titre"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEpisode.titre}
            onChange={handleInputChange}
          />

          <Box mb={2}>
            <Box display="flex" gap={2}>

                <Box flex={1}>
                    <TextField
                        label="Durée (format: XhYm)"
                        name="dure"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newEpisode.dure}
                        onChange={handleInputChange}
                    />
                </Box>

            </Box>
         </Box>
         <Box mb={2}>
            <Box display="flex" gap={2}>
               <Box flex={1}>
                    <TextField
                        label="Télécharger une vidéo"
                        type="file"
                        onChange={handleVideoChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <Box flex={1}>
                    <TextField
                        label="Télécharger une image"
                        type="file"
                        onChange={handleImageChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                </Box>
               </Box>
            </Box>
            <Box mb={2}>
            <Box display="flex" gap={2}>
               <Box flex={1}>
                    <TextareaAutosize
                        name="courteDescription"
                        placeholder="Courte Description"
                        value={newEpisode.courteDescription}
                        onChange={handleInputChange}
                        style={{ width: '100%', margin: '16px 0', padding: '29px', fontSize: '1rem' }}
                    />
                </Box>
                <Box flex={1}>
                    <TextareaAutosize
                        name="description"
                        placeholder="Description"
                        value={newEpisode.description}
                        onChange={handleInputChange}
                        style={{ width: '100%', margin: '16px 0', padding: '29px', fontSize: '1rem' }}
                    />
                 </Box>
                </Box>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAddSerie} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Modifier le film</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            name="titre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentEpisode?.titre}
            onChange={handleEditInputChange}
          />

          <Box mb={2}>
            <Box display="flex" gap={2}>


                <Box flex={1}>
                    <TextField
                        label="Durée (format: XhYm)"
                        name="dure"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentEpisode?.dure}
                        onChange={handleEditInputChange}
                    />
                </Box>

              </Box>
            </Box>


    <Box mb={2}>
      <Box display="flex" gap={2}>
        <Box flex={1}>
          <TextField
            label="Télécharger une vidéo"
            type="file"
            onChange={handleVideoChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          </Box>
          <Box flex={1}>
            <TextField
                label="Télécharger une image"
                type="file"
                onChange={handleEditImageChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
          </Box>
       </Box>
    </Box>
        <Box mb={2}>
            <Box display="flex" gap={2}>
               <Box flex={1}>
                <TextareaAutosize
                    name="courteDescription"
                    placeholder="Courte Description"
                    value={currentEpisode?.courteDescription}
                    onChange={handleEditInputChange}
                    style={{ width: '100%', margin: '16px 0', padding: '8px', fontSize: '1rem' }}
                />
                </Box>
                <Box flex={1}>
                <TextareaAutosize
                    name="description"
                    placeholder="Description"
                    value={currentEpisode?.description}
                    onChange={handleEditInputChange}
                    style={{ width: '100%', margin: '16px 0', padding: '8px', fontSize: '1rem' }}
                />
                </Box>
            </Box>
        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleEditEpisode} color="primary">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EpisodeList;
