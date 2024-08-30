import { useState, ChangeEvent, FormEvent } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
//import paths from 'routes/paths';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select,{ StylesConfig , CSSObjectWithLabel,GroupBase} from 'react-select';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface User {
  [key: string]: string | File;
}

interface CountryOption {
  value: string;
  label: string;
}

const countries: CountryOption[] = [
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Albania', label: 'Albania' },
  { value: 'Algeria', label: 'Algeria' },
  { value: 'American Samoa', label: 'American Samoa' },
  { value: 'Andorra', label: 'Andorra' },
  { value: 'Angola', label: 'Angola' },
  { value: 'Senegal', label: 'Senegal' },
  { value: 'Mali', label: 'Mali' },
  { value: 'Cote d\'ivoire', label: "Cote d'ivoire" },
  { value: 'Guinee', label: 'Guinee' },
  { value: 'Niger', label: 'Niger' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Tchad', label: 'Tchad' },
  { value: 'France', label: 'France' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Morocco', label: 'Morocco' },
  // Ajoutez d'autres pays si nécessaire
];

const Signup = () => {
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

  /*const handleFileChange = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };*/

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
     const formData = new FormData();
      formData.append('nom',user.nom);
      formData.append('prenom',user.prenom);
      formData.append('email',user.email);
      formData.append('password',user.password);
      formData.append('contact',user.contact);
      formData.append('date',user.date);
      formData.append('pays',user.pays);
      formData.append('photo',user.photo);
      const userData = {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: user.password,
        contact: user.contact,
        date: user.date,
        pays: user.pays,
        photo: user.photo || null // Ajouter `null` si `photo` n'est pas fourni
      };
      console.log(userData );
      const response = await axios.post('http://localhost:8000/api/create-utilisateur', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

  const handlePhoneChange = (value: string) => {
    setUser({ ...user, contact: value });
  };

  const handleCountryChange = (option: CountryOption | null) => {
    if (option) {
      setUser({ ...user, pays: option.value });
    }
  };
  interface CountryOption {
    value: string;
    label: string;
  }


  const customStyles: StylesConfig<CountryOption, false, GroupBase<CountryOption>> = {
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
      backgroundColor: state.isSelected ? 'white' : 'dark',
      color: 'black',
      '&:hover': {
        backgroundColor: '#333',
      },
    }),
    singleValue: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: '#fff',
    }),
    placeholder: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: '#aaa',
    }),
  };

  return (
    <>
      <Typography align="center" variant="h3" fontWeight={600}>
       Inscription
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} mt={4} spacing={2} width={1}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<IconifyIcon icon="uim:google" />}
        >
          Inscription avec Google
        </Button>

      </Stack>
      <Divider sx={{ my: 3 }}>ou inscrivez-vous avec</Divider>
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
          placeholder="Your Email"
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
          placeholder="Your Password"
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
        <Select
          options={countries}
          onChange={handleCountryChange}
          placeholder="Votre Pays"
          styles={customStyles}
          required
        />
        <Input
          id="date"
          name="date"
          type="date"
          value={user.date}
          onChange={handleInputChange}
          placeholder="Date"
          fullWidth
          required
        />
        <PhoneInput
          country={'sn'}
          value={user.contact as string}
          onChange={handlePhoneChange}
          inputStyle={{ width: '100%' }}
        />
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
        S'inscrire
        </Button>
      </Stack>
      <Typography variant="body2" align="center" mt={2}>
        Vous avez déjà un compte ?
        <Link href='/'> Connectez-vous</Link>
      </Typography>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Inscription Réussie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Votre compte a été créé avec succès.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
          <Link href='/'>Fermer</Link>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Signup;
