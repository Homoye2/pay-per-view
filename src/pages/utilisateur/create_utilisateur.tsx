import { useState, ChangeEvent, FormEvent } from 'react';
//import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
//import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
//import paths from 'routes/paths';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface User {
  [key: string]: string | File;
}

const Create = () => {
  const [user, setUser] = useState<User>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    contact: '',
    date: '',
    pays: '',
    photo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, files } = e.target;
    if (type === 'file' && files && files.length > 0) {
      setUser({ ...user, [name]: files[0] });
    } else {
      setUser({ ...user, [name]: e.target.value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {


      const userData = {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: user.password,
      };

      const response = await axios.post('http://localhost:8000/api/create-administrateur', userData, {
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
  };

  return (
    <>
      <Typography align="center" variant="h3" fontWeight={600}>
        Create Administrateur
      </Typography>
      <Stack onSubmit={handleSubmit} component="form" direction="column" gap={2}>
        <TextField
          id="nom"
          name="nom"
          type="text"
          value={user.nom}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Votre Nom"
          autoComplete="name"
          fullWidth
          autoFocus
          required
        />
        <TextField
          id="prenom"
          name="prenom"
          type="text"
          value={user.prenom}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Votre Prenom"
          autoComplete="name"
          fullWidth
          autoFocus
          required
        />
        <TextField
          id="email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Votre Email"
          autoComplete="email"
          fullWidth
          autoFocus
          required
        />
        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={user.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Votre Password"
          autoComplete="current-password"
          fullWidth
          autoFocus
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ opacity: user.password ? 1 : 0 }}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <IconifyIcon icon={showPassword ? 'ion:eye' : 'ion:eye-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Create
        </Button>
      </Stack>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Creation Réussie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Le compte administrateur a été créé avec succès.
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

export default Create;
