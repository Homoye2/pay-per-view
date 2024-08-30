/*import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TransactionUser from 'components/sections/dashboard/transaction-user';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { Card, CardContent, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select, { StylesConfig, CSSObjectWithLabel, GroupBase, SingleValue } from 'react-select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import useUsers from 'components/sections/dashboard/orders-status/useUsers';
import useVideos from 'pages/video/useVideo';
import 'react-phone-input-2/lib/style.css';
import paypalImg from '../../assets/images/paypal.png';
import orangeImg from '../../assets/images/orange.png';
import waveImg from '../../assets/images/wave.png';
import TransactionsIcon from '@mui/icons-material/History';

interface Transaction {
  montant: string;
  utilisateur_id: number | string;
  video_id: number | string;
  statut: string;
}

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  date: string;
  statut: string;
  pays: string;
  contact: string;
}

interface Video {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  prix: string;
  pathImage: string;
  statut: string;
}

interface UserOption {
  value: number;
  label: string;
}

interface VideoOption {
  value: number;
  label: string;
  prix: string;
}

const Transaction: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [transaction, setTransaction] = useState<Transaction>({
    montant: '',
    utilisateur_id: '',
    video_id: '',
    statut: '',
  });
  const [refresh, setRefresh] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const usersData = useUsers();
  const videosData = useVideos();

  useEffect(() => {
    if (usersData) {
      setUsers(usersData as User[]);
    }
  }, [usersData]);

  useEffect(() => {
    if (videosData) {
      setVideos(videosData as Video[]);
    }
  }, [videosData]);

  // Convert user list to react-select options
  const userOptions: UserOption[] = users.map((user) => ({
    value: user.id,
    label: `${user.nom} ${user.prenom}`,
  }));

  // Convert video list to react-select options
  const videoOptions: VideoOption[] = videos.map((video) => ({
    value: video.id,
    label: video.titre,
    prix: video.prix,
  }));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUserChange = (option: SingleValue<UserOption | VideoOption>) => {
    if (option && 'value' in option) {
      setTransaction({ ...transaction, utilisateur_id: option.value });
    }
  };

  const handleVideoChange = (option: SingleValue<UserOption | VideoOption>) => {
    if (option && 'prix' in option) {
      setTransaction({ ...transaction, video_id: option.value, montant: option.prix });
    }
  };

  const customStyles: StylesConfig<UserOption | VideoOption, false, GroupBase<UserOption | VideoOption>> = {
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
      color: 'white',
      '&:hover': {
        backgroundColor: '#ddd',
      },
    }),
    singleValue: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: '#000',
    }),
    placeholder: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: '#aaa',
    }),
  };

  const handleAddTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/create-transaction', transaction, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      console.log(response.data);
      setOpen(false);
      setRefresh(!refresh);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleTransactionInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleCardClick = (type: string) => {
    setModalType(type);
    setOpen(true);
  };

  const renderModalContent = () => {
    return (
      <>
        <TextField
          id="phone"
          name="phone"
          type="text"
          value={transaction.utilisateur_id.toString()}
          onChange={handleTransactionInputChange}
          variant="filled"
          placeholder="Numéro de téléphone"
          fullWidth
          autoFocus
          required
        />
        <TextField
          id="montant"
          name="montant"
          type="number"
          value={transaction.montant}
          onChange={handleTransactionInputChange}
          variant="filled"
          placeholder="Montant"
          fullWidth
          required
        />
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button type="submit" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </>
    );
  };

  return (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={12} md={12}>
        <Box display="flex" flexWrap="wrap" gap={2} mb={1} mt={1}>
          <Card sx={{ flex: '1 1 200px', maxWidth: '100%' }} onClick={() => handleCardClick('Orange Money')}>
            <CardContent sx={{ padding: 2 }}>
              <Box display="flex" alignItems="center">
                <img src={orangeImg} alt="orange" style={{ height: 50, width: 50 }} />
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  Orange Money
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                Transaction
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', maxWidth: '100%' }} onClick={() => handleCardClick('PayPal')}>
            <CardContent sx={{ padding: 2 }}>
              <Box display="flex" alignItems="center">
                <img src={paypalImg} alt="Paypal" style={{ height: 50, width: 50 }} />
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  Paypal
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                Transaction
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', maxWidth: '100%' }} onClick={() => handleCardClick('Waves')}>
            <CardContent sx={{ padding: 2 }}>
              <Box display="flex" alignItems="center">
                <img src={waveImg} alt="wave" style={{ height: 50, width: 50 }} />
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  Wave
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                Transaction
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>

          <Typography variant="h4" component="h3">
          <TransactionsIcon style={{ top :'200px' }} />Les transactions des utilisateurs
          </Typography>
          <IconButton color="error" style={{ color: 'rgb(128, 0, 0)' }} onClick={handleOpen}>
            <AddIcon fontSize='large' />
          </IconButton>
        </Box>
        <TransactionUser refresh={refresh} />
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Ajouter Transaction</DialogTitle>
          <DialogContent>
            <form onSubmit={handleAddTransaction}>
              <Stack direction="column" gap={2}>
                <Select
                  options={userOptions}
                  onChange={handleUserChange}
                  placeholder="Utilisateur"
                  styles={customStyles}
                  required
                />
                <Select
                  options={videoOptions}
                  onChange={handleVideoChange}
                  placeholder="Vidéo"
                  styles={customStyles}
                  required
                />
                <TextField
                  id="montant"
                  name="montant"
                  type="number"
                  value={transaction.montant}
                  onChange={handleTransactionInputChange}
                  variant="filled"
                  placeholder="Montant"
                  fullWidth
                  autoFocus
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Annuler
                  </Button>
                  <Button type="submit" color="primary">
                    Ajouter
                  </Button>
                </DialogActions>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default Transaction;*/
import React, { useState, FormEvent, ChangeEvent, } from 'react';
import Grid from '@mui/material/Grid';
import TransactionUser from 'components/sections/dashboard/transaction-user';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { Card, CardContent, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
//import Select, { StylesConfig, CSSObjectWithLabel, GroupBase, SingleValue } from 'react-select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import axios from 'axios';

import 'react-phone-input-2/lib/style.css';
import paypalImg from '../../assets/images/paypal.png';
import orangeImg from '../../assets/images/orange.png';
import waveImg from '../../assets/images/wave.png';
//import TransactionsIcon from '@mui/icons-material/History';

interface Transaction {
  montant: string;
  utilisateur_id: number | string;
  video_id: number | string;
  statut: string;
}




const Transaction: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [transaction, setTransaction] = useState<Transaction>({
    montant: '',
    utilisateur_id: '',
    video_id: '',
    statut: '',
  });
  const [refresh, setRefresh] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);
//   const [videos, setVideos] = useState<Video[]>([]);
 // const usersData = useUsers();
  //const videosData = useVideos();

  /*useEffect(() => {
    if (usersData) {
      setUsers(usersData as User[]);
    }
  }, [usersData]);

  useEffect(() => {
    if (videosData) {
      setVideos(videosData as Video[]);
    }
  }, [videosData]);*/

  // Convert user list to react-select options
  /*const userOptions: UserOption[] = users.map((user) => ({
    value: user.id,
    label: `${user.nom} ${user.prenom}`,
  }));

  // Convert video list to react-select options
  const videoOptions: VideoOption[] = videos.map((video) => ({
    value: video.id,
    label: video.titre,
    prix: video.prix,
  }));*/

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 /* const handleUserChange = (option: SingleValue<UserOption | VideoOption>) => {
    if (option && 'value' in option) {
      setTransaction({ ...transaction, utilisateur_id: option.value });
    }
  };

  const handleVideoChange = (option: SingleValue<UserOption | VideoOption>) => {
    if (option && 'prix' in option) {
      setTransaction({ ...transaction, video_id: option.value, montant: option.prix });
    }
  };

  const customStyles: StylesConfig<UserOption | VideoOption, false, GroupBase<UserOption | VideoOption>> = {
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
      color: '#000',
    }),
    placeholder: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: '#aaa',
    }),
  };*/

  const handleAddTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/create-transaction', transaction, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      console.log(response.data);
      setOpen(false);
      setRefresh(!refresh);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleTransactionInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleCardClick = (type: string) => {
    setModalType(type);
    setOpen(true);
  };

  const renderModalContent = () => {
    return (
      <>
        <TextField
          id="phone"
          name="phone"
          type="text"

          onChange={handleTransactionInputChange}
          variant="filled"
          placeholder="Numéro de téléphone"
          fullWidth
          autoFocus
          required
        />
        <TextField
          id="montant"
          name="montant"
          type="number"
          value={transaction.montant}
          onChange={handleTransactionInputChange}
          variant="filled"
          placeholder="Montant"
          fullWidth
          required
        />
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button type="submit" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </>
    );
  };

  return (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={12} md={12}>
        <Box display="flex" flexWrap="wrap" gap={2} mb={1} mt={1}>
          <Card sx={{ flex: '1 1 200px', maxWidth: '100%' }} onClick={() => handleCardClick('Orange Money')}>
            <CardContent sx={{ padding: 2 }}>
              <Box display="flex" alignItems="center">
                <img src={orangeImg} alt="orange" style={{ height: 50, width: 50 }} />
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  Orange Money
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                Transaction
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', maxWidth: '100%' }} onClick={() => handleCardClick('Paypal')}>
            <CardContent sx={{ padding: 2 }}>
              <Box display="flex" alignItems="center">
                <img src={paypalImg} alt="Paypal" style={{ height: 50, width: 50 }} />
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  Paypal
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                Transaction
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', maxWidth: '100%' }} onClick={() => handleCardClick('Wave')}>
            <CardContent sx={{ padding: 2 }}>
              <Box display="flex" alignItems="center">
                <img src={waveImg} alt="wave" style={{ height: 50, width: 50 }} />
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  Wave
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                Transaction
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h3">
             Les transactions des utilisateurs
          </Typography>
          <IconButton color="error" style={{ color: 'rgb(128, 0, 0)' }} onClick={handleOpen}>
            <AddIcon fontSize="large" />
          </IconButton>
        </Box>
        <TransactionUser refresh={refresh} />
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Ajouter Transaction</DialogTitle>
          <DialogContent>
            <form onSubmit={handleAddTransaction}>
              <Stack direction="column" gap={2}>
                {modalType && renderModalContent()}
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default Transaction;
