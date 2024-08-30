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

interface Serie {
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
  saison: string;
  statut: string;
}
 interface Episode {
     id: number;
     titre: string;
     videoID: number;
     videoData: string;
     dure:string;
     episode :string;
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


const SerieList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const seriesPerPage = 10;
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [series, setSeries] = useState<Serie[]>([]);
  const [currentSerie, setCurrentSerie] = useState<Serie | null>(null);


  const [image, setImage] = useState<File | null>(null);
  //const [videoDures, setVideoDures] = useState<{[key: number]: number }>([]);

  const [newSerie, setNewSerie] = useState<Partial<Serie>>({
    titre: '', prix: 0, videoUrl: '', courteDescription: '', annee: '', auteur: '', dure: '', categorie: '', description: '',statut:'', pathImage: ''
  });

  const navigate = useNavigate();

useEffect(()=>{
    fetchSeries();
},[],);

    // Fetch film data (Replace with your own API call)
    const fetchSeries = async () => {
        try {
          const seriesResponse = await axios.get<Episode[]>('http://localhost:8000/api/serie-dure');
          const seriesData = seriesResponse.data;
          console.log(seriesData);

          const response = await axios.get<Serie[]>('http://localhost:8000/api/video-categorie/serie');
          console.log(response.data);

          const filmsWithDate = response.data.map((film) => {
            // Find all episodes for the current film
            const relatedEpisodes = seriesData.filter((episode) => episode.videoID === film.id);

            // Calculate total duration of all episodes
            const countEpisode = relatedEpisodes.length;

            return {
              ...film,
              dure: countEpisode.toString(),
            };
          });

          setSeries(filmsWithDate);
        } catch (error) {
          console.error('Error fetching series data:', error);
        }
      };



  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredSeries = series.filter(serie => serie.titre.toLowerCase().includes(search.toLowerCase()));
  const startIndex = (page - 1) * seriesPerPage;
  const endIndex = startIndex + seriesPerPage;
  const currentSeries = filteredSeries.slice(startIndex, endIndex);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewSerie({ titre: '', prix: 0, videoUrl: '', courteDescription: '', annee: '', auteur: '', dure: '', categorie: '', description: '', statut:'', pathImage: '' });
  };

  const handleEditOpen = (serie: Serie) => {
    setCurrentSerie(serie);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentSerie(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSerie({ ...newSerie, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (currentSerie) {
      const { name, value } = e.target;
      setCurrentSerie({ ...currentSerie, [name]: value });
    }
  };



  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {

        setNewSerie({ ...newSerie, pathImage: file.name });
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

  const handleCategorieChange = (option: CategorieOption | null) => {
    if (option) {
      setNewSerie({ ...newSerie, categorie: option.value });
    }
  };

  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return `${str.substring(0, maxLength)}...`;
    }
    return str;
  };

  const handleAddSerie = async () => {
    if (image) {
      const formData = new FormData();

      formData.append('titre', newSerie.titre || '');
      formData.append('prix', newSerie.prix?.toString() || '');
      formData.append('description', newSerie.description || '');
      formData.append('pathImage', image);
      formData.append('categorie', 'serie');
      formData.append('type', newSerie.categorie || '');
      formData.append('auteur', newSerie.auteur || '');
      formData.append('courteDescription', newSerie.courteDescription || '');
      //formData.append('dure', durationToTime(newSerie.dure || ''));
      formData.append('annee', newSerie.annee || '');
      console.log(formData);

      try {
        await axios.post('http://localhost:8000/api/create-serie', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        });
        fetchSeries();
        handleClose();
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  const handleEditSerie = async () => {
    console.log(image);
    if (currentSerie && image) {
      const formData = new FormData();

      formData.append('titre', currentSerie.titre);
      formData.append('prix', currentSerie.prix.toString());
      formData.append('description', currentSerie.description);
      formData.append('pathImage', image);
      formData.append('categorie', 'serie');
      formData.append('type', currentSerie.categorie);
      formData.append('auteur', currentSerie.auteur);
      formData.append('courteDescription', currentSerie.courteDescription);

      formData.append('annee', currentSerie.annee);
      console.log([...formData.entries()]);

      try {
        const response=await axios.post(`http://localhost:8000/api/update-video-serie/${currentSerie.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
         },

        });
        console.log(response.data);
        fetchSeries();
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
        Listes des Series
      </Typography>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Rechercher une serie"
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
          Ajouter Une Serie
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Saison</TableCell>
              <TableCell>Episode</TableCell>
              <TableCell>Auteur</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSeries.map((serie ) => (
              <TableRow key={serie.id}>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{serie.id}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{serie.titre}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{serie.saison}</TableCell>
                <TableCell>{serie.dure}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{serie.auteur}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{serie.prix}</TableCell>

                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{truncateString(serie.courteDescription,10)}</TableCell>
                <TableCell sx={{fontSize:'0.8rem',padding:'6px 12px'}}>{serie.statut}</TableCell>
                <TableCell>
                     {serie.pathImage && (
                      <img src={`http://localhost:8000/storage/${serie.pathImage}`} alt={serie.titre} style={{ width: '50px', height: 'auto' }} />
                    )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`${paths.serieEpisode}/${serie.id}`)}
                    size="small"
                  >
                    <VisibilityIcon fontSize='small'  style={{ width :'10px'}}/>
                  </IconButton>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEditOpen(serie)}
                  >
                    <EditIcon fontSize='small'  style={{ width :'10px'}}/>
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={async () => {
                      try {
                        await axios.delete(`http://localhost:8000/api/video-delete/${serie.id}`);
                        fetchSeries();
                      } catch (error) {
                        console.error('Error deleting film:', error);
                      }
                    }}
                      size="small"
                  >
                    <DeleteIcon fontSize='small'  style={{ width :'10px'}}/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredSeries.length / seriesPerPage)}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter Une Serie</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            name="titre"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newSerie.titre}
            onChange={handleInputChange}
            required
          />
           <Select
            styles={customStyles}
            options={categoriesOptions}
            value={categoriesOptions.find(option => option.value === newSerie.categorie)}
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
                        value={newSerie.prix}
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
                        value={newSerie.auteur}
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
                        value={newSerie.annee}
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
                        value={newSerie.courteDescription}
                        onChange={handleInputChange}
                        style={{ width: '100%', margin: '16px 0', padding: '29px', fontSize: '1rem' }}
                        required
                    />
                </Box>
                <Box flex={1}>
                    <TextareaAutosize
                        name="description"
                        placeholder="Description"
                        value={newSerie.description}
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
          <Button onClick={handleAddSerie} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Modifier Le Serie</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            name="titre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentSerie?.titre}
            onChange={handleEditInputChange}
            required
          />
           <Select
            styles={customStyles}
            options={categoriesOptions}
            value={categoriesOptions.find(option => option.value === currentSerie?.categorie)}
            onChange={(option) => {
              if (currentSerie && option) {
                setCurrentSerie({ ...currentSerie, categorie: option.value });
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
                        value={currentSerie?.prix}
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
                        value={currentSerie?.auteur}
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
                        value={currentSerie?.annee}
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
                    value={currentSerie?.courteDescription}
                    onChange={handleEditInputChange}
                    style={{ width: '100%', margin: '16px 0', padding: '8px', fontSize: '1rem' }}
                    required
                />
                </Box>
                <Box flex={1}>
                <TextareaAutosize
                    name="description"
                    placeholder="Description"
                    value={currentSerie?.description}
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
          <Button onClick={handleEditSerie} color="primary">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SerieList;
