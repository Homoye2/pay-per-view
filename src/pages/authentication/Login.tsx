import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import axios from 'axios';
import { useAuth } from 'components/AuthContext';

interface User {
  [key: string]: string;
}

const Login = () => {
  const [user, setUser] = useState<User>({ email: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); //
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Appel du hook useAuth ici

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked); // Mettre à jour l'état de la case à cocher
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = {
        email: user.email,
        password: user.password,
      };

      const response = await axios.post('http://localhost:8000/api/login', userData, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      const userDataResponse = response.data.user;
      localStorage.setItem('user', JSON.stringify(userDataResponse));
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userDataResponse)); // Stocker dans localStorage
      } else {
        sessionStorage.setItem('user', JSON.stringify(userDataResponse)); // Stocker dans sessionStorage
      }
      login(userDataResponse.role); // Définir l'état d'authentification

      if (response.data.user.role === 'admin') {
        navigate(paths.dashboard);
      } else if(response.data.user.role==='visiteur') {
        console.log(response.data.user.role);
        navigate(paths.accueil);
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError("Erreur , s'il vous plaît essayer encore")
      }
    }
  };

  return (
    <>
      <Typography align="center" variant="h3" fontWeight={600}>
        Connexion
      </Typography>
      {error && <p style={{ color: 'red', textAlign:'center' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '32px', gap: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<IconifyIcon icon="uim:google" />}
        >
          Se connecter avec Google
        </Button>
      </div>
      <Divider sx={{ my: 3 }}>ou connectez-vous avec</Divider>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          placeholder="Votre Mot de Passe"
          autoComplete="current-password"
          fullWidth
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-12px' }}>
        <FormControlLabel
            control={<Checkbox id="checkbox" name="checkbox" color="primary" checked={rememberMe} onChange={handleCheckboxChange} />}
            label="Se souvenir de moi"
          />
          <Link href={paths.forgotPassword} fontSize="body2.fontSize" letterSpacing={0.5}>
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" variant="contained" size="medium" fullWidth>
          Se connecter
        </Button>
        <Typography
          my={3}
          color="text.secondary"
          variant="body2"
          align="center"
          letterSpacing={0.5}
        >
          Vous n'avez pas de compte ? <Link href={paths.signup}>{'S\'inscrire'}</Link>
        </Typography>
      </form>
    </>
  );
};

export default Login;
