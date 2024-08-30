import { useTheme } from '@mui/material/styles';
import { useState, ChangeEvent, FormEvent, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef, GridActionsCellItem, GridPaginationModel } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Select, { StylesConfig, CSSObjectWithLabel, GroupBase } from 'react-select';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import useUsers from './useUsers';
import paths from 'routes/paths';
import { useNavigate } from 'react-router-dom';

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
];

const countries: SelectOption[] = [
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Albania', label: 'Albania' },
  { value: 'Senegal', label: 'Senegal' },
  { value: 'Côte d\'ivoire', label: 'Côte d\'ivoire' },
  { value: 'Mali', label: 'Mali' },
  { value: 'Guinée', label: 'Guinée' },
  { value: 'France', label: 'France' },
  { value: 'Allemand', label: 'Allemand' },
  { value: 'USA', label: 'USA' },
  { value: 'Russie', label: 'Russie' },
  { value: 'Chini', label: 'Chini' },
  { value: 'Togo', label: 'Togo' },
  { value: 'Tchad', label: 'Tchad' },
  { value: 'Mauritanie', label: 'Mauritanie' },
  { value: 'Algerie', label: 'Algerie' },
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

const OrdersStatus = () => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 6,
  });
  const navigate = useNavigate();
  const usersData = useUsers();

  useEffect(() => {
    if (usersData) {
      setUsers(usersData as User[]);
    }
  }, [usersData]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => prevUser ? { ...prevUser, [name]: value } : null);
    setSearchText(value);
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.nom} ${user.prenom}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const ordersStatusData = filteredUsers.map((user) => ({
    id: user.id,
    client: `${user.nom} ${user.prenom}`,
    email: user.email,
    date: new Date(user.date),
    status: user.statut,
    country: user.pays,
  }));

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleUserInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => prevUser ? { ...prevUser, [name]: value } : null);
  }, []);

  const openConfirmModal = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteOpen(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/utilisateurs', {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setUsers(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdate = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      const userData = {
        nom: selectedUser.nom,
        prenom: selectedUser.prenom,
        email: selectedUser.email,
        contact: selectedUser.contact,
        date: selectedUser.date,
        pays: selectedUser.pays,
        statut: selectedUser.statut,
      };

      const response = await axios.put(`http://localhost:8000/api/utilisateur/${selectedUser.id}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      await fetchUsers();
      console.log(response.data);
      openConfirmModal();
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }, [selectedUser, fetchUsers, openConfirmModal]);

  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`http://localhost:8000/api/utilisateur/${selectedUser.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      await fetchUsers();

      closeDeleteModal();
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }, [selectedUser, fetchUsers, closeDeleteModal]);
  const openViewModal = useCallback((id: number) => {
    const user = users.find((user) => Number(user.id) === id);

    if (user) {
      setSelectedUser(user);
      setViewOpen(true);
    }
  }, [users])

  const handleEdit = useCallback((id: number) => {
    const user = users.find((user) => Number(user.id) === id);

    if (user) {
      setSelectedUser({
        id: Number(user.id),
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        date: user.date,
        statut: user.statut,
        pays: user.pays,
        contact: user.contact,
      });
      setOpen(true);
    }
  }, [users]);

  const handleDelete = useCallback((id: number) => {
    const user = users.find((user) => Number(user.id) === id);

    if (user) {
      setSelectedUser({
        id: Number(user.id),
      });
    }
    ;
    setDeleteOpen(true);
  }, [users]);

  const handleView = useCallback((id: number) => {
    openViewModal(id);
  }, [openViewModal]);

  const handleAction = useCallback((id: number) => {

    navigate(`${paths.utilisateur}/${id}`);
  }, [navigate]);

  const handlePaginationChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model);
  }, []);

  const handleCountryChange = useCallback((selectedOption: SelectOption | null) => {
    if (selectedOption) {
      setSelectedUser((prevUser) => prevUser ? { ...prevUser, pays: selectedOption.value } : null);
    }
  }, []);

  const handleStatusChange = useCallback((selectedOption: SelectOptionStatus | null) => {
    if (selectedOption) {
      setSelectedUser((prevUser) => prevUser ? { ...prevUser, statut: selectedOption.value } : null);
    }
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setSelectedUser((prevUser) => prevUser ? { ...prevUser, contact: value } : null);
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'client', headerName: 'Client', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      type: 'date',
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'country', headerName: 'Country', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<IconifyIcon icon={'mdi:eye'} />}
          label="View"
          onClick={() => handleView(Number(params.id))}
        />,
        <GridActionsCellItem
        icon={<IconifyIcon icon={'mdi:layers'} />}
        label="Layers"
        onClick={() => handleAction(Number(params.id))}
        />,
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
            Statut des Clients
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
                options={countries}
                onChange={handleCountryChange}
                value={countries.find((country) => country.value === selectedUser?.pays)}
                placeholder="Votre Pays"
                styles={customStyles}
                required
              />
              <Select
                options={statut}
                onChange={handleStatusChange}
                value={statut.find((status) => status.value === selectedUser?.statut)}
                placeholder="Votre statut"
                styles={customStyles}
                required
              />
              <Input
                id="date"
                name="date"
                type="date"
                value={selectedUser?.date || ''}
                onChange={handleUserInputChange}
                placeholder="Date"
                fullWidth
                required
              />
              <PhoneInput
                country={'sn'}
                value={selectedUser?.contact || ''}
                onChange={handlePhoneChange}
                inputStyle={{ width: '100%' }}
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
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
  <DialogTitle>Détails de l'Utilisateur</DialogTitle>
  <DialogContent>
    {selectedUser && (
      <div>
        <Typography variant="h6">Nom : {selectedUser.nom}</Typography>
        <Typography variant="h6">Prénom : {selectedUser.prenom}</Typography>
        <Typography variant="h6">Email : {selectedUser.email}</Typography>
        <Typography variant="h6">Date : {selectedUser.date}</Typography>
        <Typography variant="h6">Statut : {selectedUser.statut}</Typography>
        <Typography variant="h6">Pays : {selectedUser.pays}</Typography>
        <Typography variant="h6">Contact : {selectedUser.contact}</Typography>
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setViewOpen(false)} color="secondary">
      Fermer
    </Button>
  </DialogActions>
</Dialog>
    </Paper>
  );
};

export default OrdersStatus;
