import { useTheme } from '@mui/material/styles';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef, GridActionsCellItem, GridPaginationModel  } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import Select, { StylesConfig, CSSObjectWithLabel, GroupBase } from 'react-select';

import axios from 'axios';
import useAdmins from './useAdmins';


interface Admin {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  statut: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptionStatus {
    value: string;
    label: string;
}

const statut: SelectOptionStatus[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  // Ajoutez d'autres pays si nécessaire
];
const customStyles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
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
      backgroundColor: state.isSelected ? 'white' : '#f0f0f0',
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
      color: '#aaa',
    }),
  };

const OrdersAdmin = () => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedUser, setSelectedUser] = useState<Partial<Admin> | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 6,
  });
  //const navigate = useNavigate();
  const adminsData = useAdmins();

  useEffect(() => {
    if (adminsData) {
      setAdmins(adminsData as Admin[]); // Utilisez un type d'assertion si nécessaire
    }
  }, [adminsData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => prevUser ? { ...prevUser, [name]: value } : null);
    setSearchText(value);
  };

  const filteredUsers = admins.filter((admin) =>
    `${admin.nom} ${admin.prenom}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const ordersStatusData = filteredUsers.map((admin) => ({
    id: admin.id,
    client: `${admin.nom} ${admin.prenom}`,
    email: admin.email,

    status: admin.statut,

  }));

  const handleClose = () => {
    setOpen(false);
  };

  const handleUserInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => prevUser ? { ...prevUser, [name]: value } : null);
  };

  const openConfirmModal = () => {
    setConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmOpen(false);
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/administrateurs', {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setAdmins(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Pour la modification de l'utilisateur
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      const userData = {
        nom: selectedUser.nom,
        prenom: selectedUser.prenom,
        email: selectedUser.email,
        statut: selectedUser.statut,
      };

      await axios.put(`http://localhost:8000/api/administrateur/${selectedUser.id}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      await fetchAdmins();

      openConfirmModal();
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  // Pour la suppression de l'utilisateur
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`http://localhost:8000/api/administrateur/${selectedUser.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      await fetchAdmins();

      closeDeleteModal();
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleEdit = (id: number) => {
    const admin = admins.find((admin) => Number(admin.id) === id);

    if (admin) {
      setSelectedUser({
        id: Number(admin.id),
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        statut: admin.statut,
      });
      setOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const admin = admins.find((admin) => Number(admin.id) === id);

    if (admin) {
      setSelectedUser({
        id: Number(admin.id),
      });
    }

    setDeleteOpen(true);
  };



  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

  const handleCountryChange = (selectedOption: SelectOption | null) => {
    if (selectedOption) {
      setSelectedUser((prevUser) => prevUser ? { ...prevUser, pays: selectedOption.value } : null);
    }
  };


  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'client', headerName: 'Client', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: (params) => [

        <GridActionsCellItem
          icon={<IconifyIcon icon={'mdi:pencil'} />}
          label="Edit"
          onClick={() => handleEdit(Number(params.id))}
        />,
        <GridActionsCellItem
          icon={<IconifyIcon icon={'mdi:delete'} />}
          label="Delete"
          onClick={() => handleDelete(Number(params.id))}
        />,
      ],
    },
  ];

  return (
    <Paper sx={{ px: 0 }}>
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={400} fontFamily={theme.typography.fontFamily}>
          Statut des Administateurs
          </Typography>
          <TextField
            variant="filled"
            size="small"
            placeholder="Search for..."
            value={searchText}
            onChange={handleInputChange}
            sx={{ width: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon={'mingcute:search-line'} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <Box mt={1.5} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={ordersStatusData}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[6, 12, 24]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6,
              },
            },
          }}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Modifier Utilisateur</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <div style={{ width: '400px' }}>
              <TextField
                id="nom"
                name="nom"
                type="text"
                value={selectedUser?.nom || ''}
                onChange={handleUserInputChange}
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
                value={selectedUser?.prenom || ''}
                onChange={handleUserInputChange}
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
                value={selectedUser?.email || ''}
                onChange={handleUserInputChange}
                variant="filled"
                placeholder="Your Email"
                autoComplete="email"
                fullWidth
                required
              />

              <Select
                options={statut}
                onChange={handleCountryChange}
                value={statut.find((status) => status.value === selectedUser?.statut)}
                placeholder="Votre statut"
                styles={customStyles}
                required
              />



              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button onClick={handleClose} color="secondary">
                  Annuler
                </Button>
                <Button type="submit" color="primary" style={{ marginLeft: '8px' }}>
                  Modifier
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onClose={closeConfirmModal}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Typography>L'utilisateur à été bien modifier</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmModal} color="secondary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={closeDeleteModal}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default OrdersAdmin;
