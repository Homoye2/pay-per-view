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
import Input from '@mui/material/Input';


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
  heureDebut:string;
  heureFin: string;
  pathImage: string;
  annee: string;
  type: string;
  date: string;
  statut: string;
}

/*interface Evenement {
    id: number;
    categorie: string;
    videoID:string;
    heure_debut:string;
    heure_fin: string;
    pathImage: string;
    statut: string;
  }*/


interface CategorieOption {
  value: string;
  label: string;
}

const categoriesOptions: CategorieOption[] = [
  { value: 'privee', label: 'Privée' },
  { value: 'public', label: 'Public' },

];
interface VideoDure {
    videoID: number;
    heureDebut: string;
    heureFin: string;
    date:string;
  }

const EvenementList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const evenementsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [evenements, setEvenements] = useState<Video[]>([]);
  const [currentEvenement, setCurrentEvenement] = useState<Video | null>(null);


  const [image, setImage] = useState<File | null>(null);
  const [videoDures, setVideoDures] = useState<VideoDure[]>([]);

  const [newEvenement, setNewEvenement] = useState<Partial<Video>>({
    titre: '', prix: 0, videoUrl: '', courteDescription: '', annee: '', auteur: '', dure: '',heureDebut:'',
    heureFin: '', categorie: '', description: '',statut:'', pathImage: '', date:'',
  });

  const navigate = useNavigate();



    // Fetch film data (Replace with your own API call)
    const fetchEvenements = async () => {
      const response = await axios.get<Video[]>('http://localhost:8000/api/video-categorie/evenement');
      setEvenements(response.data);

    };
   useEffect(() => {
    // Fetch video durations
    const fetchVideoDures = async () => {
      const response = await axios.get<VideoDure[]>('http://localhost:8000/api/evenement-temps');
      setVideoDures(response.data);
    };


    fetchEvenements();
    fetchVideoDures();

  }, []);
  const getheureDebut = (id: number): string | undefined => {

    const dure = videoDures.find(videoDure => videoDure.videoID === id);

    return dure?.heureDebut;
  };
  const getheureFin = (id: number): string | undefined => {

    const dure = videoDures.find(videoDure => videoDure.videoID === id);
    return dure?.heureFin;
  };
  const getDate = (id: number): string | undefined => {

    const dure = videoDures.find(videoDure => videoDure.videoID === id);
    return dure?.date;
  };

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredEvenements = evenements.filter(evenement => evenement.titre.toLowerCase().includes(search.toLowerCase()));
  const startIndex = (page - 1) * evenementsPerPage;
  const endIndex = startIndex + evenementsPerPage;
  const currentEvenements = filteredEvenements.slice(startIndex, endIndex);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewEvenement({ titre: '', prix: 0, videoUrl: '', courteDescription: '', annee: '', auteur: '', dure: '',heureDebut:'',
        heureFin: '', categorie: '', description: '', statut:'',type:'', pathImage: '',date:'' });
  };

  const handleEditOpen = (evenement: Video) => {
    setCurrentEvenement(evenement);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentEvenement(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvenement({ ...newEvenement, [name]: value });
  };
  const handlEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
        if(currentEvenement){
    setCurrentEvenement({ ...currentEvenement, [name]: value });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (currentEvenement) {
      const { name, value } = e.target;
      setCurrentEvenement({ ...currentEvenement, [name]: value });
    }
  };



  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {

        setNewEvenement({ ...newEvenement, pathImage: file.name });
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
        setNewEvenement({ ...newEvenement, categorie: option.value });
    }
  };
  const handleEditCategorieChange = (option: CategorieOption | null) => {
    if (option) {
        if(currentEvenement){
        setCurrentEvenement({ ...currentEvenement, categorie: option.value.toString() });
     }
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
    if (image) {
      const formData = new FormData();

      formData.append('titre', newEvenement.titre || '');
      formData.append('prix', newEvenement.prix?.toString() || '');
      formData.append('description', newEvenement.description || '');
      formData.append('pathImage', image);
      formData.append('categorie','evenement');
      formData.append('type',newEvenement.categorie || '');
      formData.append('date',newEvenement.date || '');
      formData.append('auteur', newEvenement.auteur || '');
      formData.append('courteDescription', newEvenement.courteDescription || '');

      formData.append('heure_debut', durationToTime(newEvenement.heureDebut || ''));
      formData.append('heure_fin', durationToTime(newEvenement.heureFin || ''));
      formData.append('annee', newEvenement.annee || '');
      console.log([...formData.entries()]);

      try {
        await axios.post('http://localhost:8000/api/create-evenement', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        });
        fetchEvenements();
        handleClose();
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  const handleEditFilm = async () => {
    console.log(image);
    if (currentEvenement && image) {
      const formData = new FormData();

      formData.append('titre', currentEvenement?.titre);
      formData.append('prix', currentEvenement.prix.toString());
      formData.append('description', currentEvenement.description);
      formData.append('pathImage', image);
      formData.append('categorie',"evenement");
      formData.append('type',currentEvenement.categorie);
      formData.append('date',currentEvenement.date );
      formData.append('auteur', currentEvenement.auteur);
      formData.append('courteDescription', currentEvenement.courteDescription);
      formData.append('heure_debut', durationToTime(newEvenement.heureDebut || ''));
      formData.append('heure_fin', durationToTime(newEvenement.heureFin || ''));
      formData.append('annee', currentEvenement.annee);
      console.log([...formData.entries()]);

      try {
        const response=await axios.post(`http://localhost:8000/api/update-evenement/${currentEvenement.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
         },

        });
        console.log(response.data);
        fetchEvenements();
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
        Listes des Evéments
      </Typography>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Rechercher un evénement"
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
          Ajouter Un Evément
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Auteur</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Debut</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentEvenements.map((evenement ) => (
              <TableRow key={evenement.id}>
                <TableCell sx={{fontSize:'10px',padding:'2px 1px'}}>{evenement.titre}</TableCell>
                <TableCell sx={{fontSize:'10px',padding:'2px 1px'}}>{evenement.auteur}</TableCell>
                <TableCell sx={{fontSize:'10px',padding:'2px 1px'}}>{evenement.prix}</TableCell>
                <TableCell sx={{fontSize:'10px',padding:'2px 1px'}}>{getDate(evenement.id)}</TableCell>
                <TableCell sx={{fontSize:'10px',padding:'2px 1px'}}>{getheureDebut(evenement.id)}</TableCell>
                <TableCell sx={{fontSize:'10px',padding:'2px 1px'}}>{getheureFin(evenement.id)}</TableCell>
                <TableCell sx={{fontSize:'10px',padding:'2px 1px'}}>{truncateString(evenement?.courteDescription,12)}</TableCell>
                <TableCell sx={{fontSize:'10px',padding:'2px 1px'}}>{evenement.statut}</TableCell>
                <TableCell>
                     {evenement.pathImage && (
                      <img src={`http://localhost:8000/storage/${evenement.pathImage}`} alt={evenement.titre} style={{ width: '50px', height: 'auto' }} />
                    )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`${paths.evenementDetail}/${evenement.id}`)}
                    size="small"
                  >
                    <VisibilityIcon fontSize='small'  style={{ width :'10px'}}/>
                  </IconButton>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEditOpen(evenement)}
                  >
                    <EditIcon fontSize='small'  style={{ width :'10px'}}/>
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={async () => {
                      try {
                        await axios.delete(`http://localhost:8000/api/video-delete/${evenement.id}`);
                        fetchEvenements();
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
          count={Math.ceil(filteredEvenements.length / evenementsPerPage)}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter Un Evénement</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            name="titre"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEvenement.titre}
            onChange={handleInputChange}
          />
           <Box mb={2}>
            <Box display="flex" gap={2}>
            <Box flex={1} sx={{ marginTop:'19px', height:'19px'}}>
                <Select
                    styles={customStyles}
                    options={categoriesOptions}
                    value={categoriesOptions.find(option => option.value === newEvenement.categorie)}
                    onChange={handleCategorieChange}
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
                        value={newEvenement.auteur}
                        onChange={handleInputChange}
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
                        value={newEvenement.annee}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box flex={1} sx={{ margin:'10px' }}>
                    <Input
                        id="Date"
                        name="date"
                        type="date"
                        placeholder="Date"
                        fullWidth

                        value={newEvenement.date}
                        onChange={handleInputChange}
                    />
                </Box>
            </Box>
          </Box>
          <Box mb={2}>
            <Box display="flex" gap={2}>
                <Box flex={1}>
                    <TextField
                        label="heure de début(format: X:Y:S)"
                        name="heureDebut"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newEvenement.heureDebut}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box flex={1} >
                <TextField
                        label="heure de fin(format: X:Y:S)"
                        name="heureFin"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newEvenement.heureFin}
                        onChange={handleInputChange}
                    />
                </Box>

              {!newEvenement.categorie || !['public'].includes(newEvenement.categorie) && (
              <Box flex={1}>

                    <TextField
                        label="Prix"
                        name="prix"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newEvenement.prix}
                        onChange={handleInputChange}
                    />
                </Box>
            )}
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
                        value={newEvenement.courteDescription}
                        onChange={handleInputChange}
                        style={{ width: '100%', margin: '16px 0', padding: '29px', fontSize: '1rem' }}
                    />
                </Box>
                <Box flex={1}>
                    <TextareaAutosize
                        name="description"
                        placeholder="Description"
                        value={newEvenement.description}
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
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentEvenement?.titre}
            onChange={handleEditInputChange}
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
                        value={currentEvenement?.prix}
                        onChange={handleEditInputChange}
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
                        value={currentEvenement?.auteur}
                        onChange={handleEditInputChange}
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
                        value={currentEvenement?.annee}
                        onChange={handleEditInputChange}
                        required
                    />

                </Box>
                <Box flex={1} sx={{ margin:'10px' }}>
                    <Input
                        id="Date"
                        name="date"
                        type="date"
                        placeholder="Date"
                        fullWidth
                        value={currentEvenement?.date}
                        onChange={handlEditInputChange}
                        required
                    />
                </Box>
            </Box>
          </Box>
          <Box mb={2}>
            <Box display="flex" gap={2}>
                <Box flex={1}>
                    <TextField
                        label="heure de début(format: XhYm)"
                        name="heure_debut"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentEvenement?.heureDebut}
                        onChange={handleEditInputChange}
                        required
                    />
                </Box>
                <Box flex={1} >
                <TextField
                        label="heure de fin(format: XhYm)"
                        name="heure_fin"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentEvenement?.heureFin}
                        onChange={handleEditInputChange}
                        required
                    />
                </Box>
                <Box flex={1} sx={{ margin:'19px' }}>
                    <Select
                        styles={customStyles}
                        options={categoriesOptions}
                        value={categoriesOptions.find(option => option.value === currentEvenement?.type)}
                        onChange={handleEditCategorieChange}
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
                        value={currentEvenement?.courteDescription}
                        onChange={handleEditInputChange}
                        style={{ width: '100%', margin: '16px 0', padding: '29px', fontSize: '1rem' }}
                        required
                    />
                </Box>
                <Box flex={1}>
                    <TextareaAutosize
                        name="description"
                        placeholder="Description"
                        value={currentEvenement?.description}
                        onChange={handleEditInputChange}
                        style={{ width: '100%', margin: '16px 0', padding: '29px', fontSize: '1rem' }}
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

export default EvenementList;
