// pages/Unauthorized.tsx

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Accès Non Autorisé
      </Typography>
      <Typography variant="body1" gutterBottom>
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Retourner à l'accueil
      </Button>
    </div>
  );
};

export default Unauthorized;
