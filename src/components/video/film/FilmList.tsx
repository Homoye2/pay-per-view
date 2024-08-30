import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  InputAdornment, TextareaAutosize
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Select, { StylesConfig, CSSObjectWithLabel, GroupBase } from 'react-select';
import IconifyIcon from 'components/base/IconifyIcon';
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
  statut: string;
}


interface CategorieOption {
  value: string;
  label: string;
}

const categoriesOptions: CategorieOption[] = [
  { value: 'Dramatique', label: 'Dramatique' },
  { value: 'Comédie', label: 'Comédie' },
  { value: 'Aventure', label: 'Aventure' },
  { value: 'Animation', label: 'Animation' },
  { value: 'Film musical', label: 'Film musical' },
  { value: 'Informatique', label: 'Informatique' },
  { value: 'Policier', label: 'Policier' },
  { value: 'Fantastique', label: 'Fantastique' },
  { value: 'Espionnage', label: 'Espionnage' },
  { value: 'Comédie dramatique', label: 'Comédie dramatique' },
  { value: 'Guerre', label: 'Guerre' },
  { value: 'Biopic', label: 'Biopic' },
  { value: 'Western', label: 'Western' },
  { value: 'Historique', label: 'Historique' },
  { value: 'Documentaire', label: 'Documentaire' },
  { value: 'Court métrage', label: 'Court métrage' },
];
interface VideoDure {
    videoID: number;
    dure: string;
  }

const FilmList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const filmsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [films, setFilms] = useState<Film[]>([]);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [videoDures, setVideoDures] = useState<VideoDure[]>([]);

  const [newFilm, setNewFilm] = useState<Partial<Film>>({
    titre: '', prix: 0, videoUrl: '', courteDescription: '', annee: '', auteur: '', dure: '', categorie: '', description: '',statut:'', pathImage: ''
  });

  const navigate = useNavigate();



    // Fetch film data (Replace with your own API call)
    const fetchFilms = async () => {
      const response = await axios.get<Film[]>('http://localhost:8000/api/video-categorie/film');
      setFilms(response.data);

    };
   useEffect(() => {
    // Fetch video durations
    const fetchVideoDures = async () => {
      const response = await axios.get<VideoDure[]>('http://localhost:8000/api/video-dure');
      setVideoDures(response.data);

    };


    fetchFilms();
    fetchVideoDures();

  }, []);
  const getDure = (id: number): string | undefined => {
    const dure = videoDures.find(videoDure => videoDure.videoID === id);
    return dure?.dure;
  };

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredFilms = films.filter(film => film.titre.toLowerCase().includes(search.toLowerCase()));
  const startIndex = (page - 1) * filmsPerPage;
  const endIndex = startIndex + filmsPerPage;
  const currentFilms = filteredFilms.slice(startIndex, endIndex);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewFilm({ titre: '', prix: 0, videoUrl: '', courteDescription: '', annee: '', auteur: '', dure: '', categorie: '', description: '', statut:'', pathImage: '' });
  };

  const handleEditOpen = (film: Film) => {
    setCurrentFilm(film);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentFilm(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFilm({ ...newFilm, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (currentFilm) {
      const { name, value } = e.target;
      setCurrentFilm({ ...currentFilm, [name]: value });
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };
  const handleEditVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFilm({ ...newFilm, videoUrl: file.name });
      };
      reader.readAsDataURL(file);
      setVideo(file);
    }
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFilm({ ...newFilm, pathImage: file.name });
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleEditImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (currentFilm) {
          setCurrentFilm({ ...currentFilm, pathImage: file.name });
        }
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleCategorieChange = (option: CategorieOption | null) => {
    if (option) {
      setNewFilm({ ...newFilm, categorie: option.value });
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

  const handleAddFilm = async () => {
    if (video && image) {
      const formData = new FormData();
      formData.append('video', video);
      formData.append('titre', newFilm.titre || '');
      formData.append('prix', newFilm.prix?.toString() || '');
      formData.append('description', newFilm.description || '');
      formData.append('pathImage', image);
      formData.append('categorie', 'film');
      formData.append('type', newFilm.categorie || '');
      formData.append('auteur', newFilm.auteur || '');
      formData.append('courteDescription', newFilm.courteDescription || '');
      formData.append('dure', durationToTime(newFilm.dure || ''));
      formData.append('annee', newFilm.annee || '');


      try {
        await axios.post('http://localhost:8000/api/create-video', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        });
        fetchFilms();
        handleClose();
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  const handleEditFilm = async () => {
    if (currentFilm && image && video) {
        const formData = new FormData();
        formData.append('video', video);
        formData.append('titre', currentFilm.titre);
        formData.append('prix', currentFilm.prix.toString());
        formData.append('description', currentFilm.description);
        formData.append('pathImage', image);
        formData.append('categorie', 'film');
        formData.append('type', currentFilm.categorie);
        formData.append('auteur', currentFilm.auteur);
        formData.append('courteDescription', currentFilm.courteDescription);
        formData.append('dure', currentFilm.dure);
        formData.append('annee', currentFilm.annee);

      try {
        const response = await axios.post(`http://localhost:8000/api/update-video/${currentFilm.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        });
        console.log(response.data);
        fetchFilms();
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



  const customStyles: StylesConfig<CategorieOption, false, GroupBase<CategorieOption>> = {
    control: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: 'transparent',
        borderColor: '#333',
        boxShadow: 'none',
        '&:hover': {
          borderColor: '#555',
        },
      }),
      menu: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: 'white',
      }),
      option: (provided: CSSObjectWithLabel, state: { isSelected: boolean }) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'white' : 'lightgray',
        color: 'black',
        '&:hover': {
          backgroundColor: '#ddd',
        },
      }),
      singleValue: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: 'white',
      }),
      placeholder: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: 'white',
      }),
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Liste des Films
      </Typography>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Rechercher un film"
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
          Ajouter un film
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Auteur</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentFilms.map((film ) => (
              <TableRow key={film.id}>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{film.titre}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}} >{film.auteur}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}} >{film.prix}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}} >{getDure(film.id)}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{truncateString(film.courteDescription,12)}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{film.statut}</TableCell>
                <TableCell>
                     {film.pathImage && (
                      <img src={`http://localhost:8000/storage/${film.pathImage}`} alt={film.titre} style={{ width: '50px', height: 'auto' }} />
                    )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`${paths.filmDetail}/${film.id}`)}
                    size="small"
                  >
                    <VisibilityIcon fontSize='small'  style={{ width :'12px'}}/>
                  </IconButton>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEditOpen(film)}
                  >
                    <EditIcon fontSize='small'  style={{ width :'12px'}}/>
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={async () => {
                      try {
                        await axios.delete(`http://localhost:8000/api/video-delete/${film.id}`);
                        fetchFilms();
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
          count={Math.ceil(filteredFilms.length / filmsPerPage)}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter un film</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            name="titre"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newFilm.titre}
            onChange={handleInputChange}
            required
          />
           <Select
            styles={customStyles}
            options={categoriesOptions}
            value={categoriesOptions.find(option => option.value === newFilm.categorie)}
            onChange={handleCategorieChange}
            required
          />
          <Box mb={2}>
            <Box display="flex" gap={2}>
               <Box flex={1}>
                    <TextField
                        label="Prix"
                        name="prix"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newFilm.prix}
                        onChange={handleInputChange}
                        required
                    />
                </Box>
                <Box flex={1}>
                    <TextField
                        label="Auteur"
                        name="auteur"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newFilm.auteur}
                        onChange={handleInputChange}
                        required
                    />
                </Box>
                <Box flex={1}>
                    <TextField
                        label="Durée (format: XhYm)"
                        name="dure"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newFilm.dure}
                        onChange={handleInputChange}
                        required
                    />
                </Box>
                 <Box flex={1}>
                    <TextField
                        label="Année"
                        name="annee"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newFilm.annee}
                        onChange={handleInputChange}
                        required
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
                        required
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
                        required
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
                        value={newFilm.courteDescription}
                        onChange={handleInputChange}
                        style={{ width: '100%', margin: '16px 0', padding: '29px', fontSize: '1rem' }}
                        required
                    />
                </Box>
                <Box flex={1}>
                    <TextareaAutosize
                        name="description"
                        placeholder="Description"
                        value={newFilm.description}
                        onChange={handleInputChange}
                        style={{ width: '100%', margin: '16px 0', padding: '29px', fontSize: '1rem' }}
                        required
                    />
                 </Box>
                </Box>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAddFilm} color="primary">
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
            value={currentFilm?.titre}
            onChange={handleEditInputChange}
            required
          />
           <Select
            styles={customStyles}
            options={categoriesOptions}
            value={categoriesOptions.find(option => option.value === currentFilm?.categorie)}
            onChange={(option) => {
              if (currentFilm && option) {
                setCurrentFilm({ ...currentFilm, categorie: option.value });
              }
            }}
            required
          />
          <Box mb={2}>
            <Box display="flex" gap={2}>
               <Box flex={1}>
                    <TextField
                        label="Prix"
                        name="prix"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentFilm?.prix}
                        onChange={handleEditInputChange}
                        required
                    />
                </Box>
                <Box flex={1}>
                    <TextField
                        label="Auteur"
                        name="auteur"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentFilm?.auteur}
                        onChange={handleEditInputChange}
                        required
                    />
                </Box>
                <Box flex={1}>
                    <TextField
                        label="Durée (format: XhYm)"
                        name="dure"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentFilm?.dure}
                        onChange={handleEditInputChange}
                        required
                    />
                </Box>
                <Box flex={1}>
                    <TextField
                        label="Année"
                        name="annee"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentFilm?.annee}
                        onChange={handleEditInputChange}
                        required
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
            onChange={handleEditVideoChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
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
                required
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
                    value={currentFilm?.courteDescription}
                    onChange={handleEditInputChange}
                    style={{ width: '100%', margin: '16px 0', padding: '8px', fontSize: '1rem' }}
                    required
                />
                </Box>
                <Box flex={1}>
                <TextareaAutosize
                    name="description"
                    placeholder="Description"
                    value={currentFilm?.description}
                    onChange={handleEditInputChange}
                    style={{ width: '100%', margin: '16px 0', padding: '8px', fontSize: '1rem' }}
                    required
                />
                </Box>
            </Box>
        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleEditFilm} color="primary">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FilmList;
