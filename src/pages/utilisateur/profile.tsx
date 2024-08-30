import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import paths from 'routes/paths';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

interface UserOld {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
}

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userFromState = location.state?.user;

  const [userOld, setUserOld] = useState<UserOld>({
    nom: '',
    prenom: '',
    email: '',
    // Initialiser le mot de passe comme une chaîne vide
  });


  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userFromState?.email) {
      handleGetAdmin(userFromState.email);
    }
  }, [userFromState?.email]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserOld({ ...userOld, [name]: value });
  };

  const handleGetAdmin = async (email: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/administrateur-email/${email}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setUserOld(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userOld) return;

    try {
      const userData = {
        nom: userOld.nom,
        prenom: userOld.prenom,
        email: userOld.email,
        // Inclure le mot de passe lors de la soumission
      };

      const response = await axios.put(`http://localhost:8000/api/administrateur/${userOld.id}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      console.log(response.data);
      setOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/');
  };

  return (
    <>
      <Typography align="center" variant="h4" fontWeight={600}>
        Modifier Votre Compte
      </Typography>
      <Box display="flex" justifyContent="center" my={2}>
        <Avatar
          src={'path/to/default/avatar.png'}
          sx={{
            bgcolor: 'primary.main',
            width: 100,
            height: 100,
          }}
        />
      </Box>
      <Stack onSubmit={handleSubmit} component="form" direction="column" gap={2}>
        <TextField
          id="nom"
          name="nom"
          type="text"
          value={userOld.nom}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Votre Nom"
          autoComplete="name"
          fullWidth
          required
        />
        <TextField
          id="prenom"
          name="prenom"
          type="text"
          value={userOld.prenom}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Votre Prenom"
          autoComplete="name"
          fullWidth
          required
        />
        <TextField
          id="email"
          name="email"
          type="email"
          value={userOld.email}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Votre Email"
          autoComplete="email"
          fullWidth
          required
        />

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Modifier
        </Button>
        <Button variant="contained" color="secondary" fullWidth onClick={() => {
          setUserOld({
            nom: '',
            prenom: '',
            email: '',
           // Réinitialiser le mot de passe
          });
          navigate(paths.dashboard);
        }}>
          Annuler
        </Button>
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Réussie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Votre compte a été modifié avec succès.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
