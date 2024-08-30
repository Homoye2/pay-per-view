import { useState, ChangeEvent, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
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
import useUsers from '../orders-status/useUsers';
import useVideos from 'pages/video/useVideo';
import axios from 'axios';

interface Transaction {
  id?: number;
  montant: number;
  utilisateur_id: number;
  video_id: number;
  statut: string;
  created_at: string;
}

interface TransactionUserProps {
  refresh: boolean;
}

const TransactionUser: React.FC<TransactionUserProps> = ({ refresh }) => {
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Partial<Transaction> | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 6,
  });

  const allUsers = useUsers();
  const allVideos = useVideos();
  const printRef = useRef<HTMLDivElement>(null);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/transactions');
      setTransactions(response.data as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedTransaction((prevUser) => (prevUser ? { ...prevUser, [name]: value } : null));
    setSearchText(value);
  };

  const filteredUsers = transactions.filter((transaction) =>
    `${transaction.montant} ${transaction.id} ${transaction.utilisateur_id} `.toLowerCase().includes(searchText.toLowerCase())
  );

  const getUserById = (id: number): string => {
    const user = allUsers.find((user) => user.id === id);
    return user ? `[ ID: ${user.id} ] ${user.nom}` : 'Unknown User';
  };

  const getVideoById = (id: number): string => {
    const video = allVideos.find((video) => video.id === id);
    return video ? `[ ID: ${video.id} ] ${video.titre}` : 'Unknown Video';
  };

  const ordersStatusData = filteredUsers.map((transaction) => ({
    id: transaction.id,
    montant: `${transaction.montant} fcfa`,
    utilisateur: getUserById(transaction.utilisateur_id),
    video: getVideoById(transaction.video_id),
    date: new Date(transaction.created_at).toLocaleDateString(),
    status: `${transaction.statut}`,
  }));

  const handleView = (id: number) => {
    const transaction = transactions.find((transaction) => Number(transaction.id) === id);
    if (transaction) {
      setSelectedTransaction({
        id: Number(transaction.id),
        montant: transaction.montant,
        utilisateur_id: transaction.utilisateur_id,
        video_id: transaction.video_id,
        created_at: transaction.created_at,
        statut: transaction.statut,
      });
    }
    setOpen(true);
  };

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

  const closeConfirmModal = () => {
    setOpen(false);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to reset the page content
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', flex: 1 },
    { field: 'montant', headerName: 'Montant', flex: 1 },
    { field: 'utilisateur', headerName: 'Utilisateur', flex: 1 },
    { field: 'video', headerName: 'Video', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<IconifyIcon icon={'mdi:printer'} />}
          label="Print"
          onClick={() => handleView(Number(params.id))}
        />,
      ],
    },
  ];

  return (
    <Paper sx={{ px: 0 }}>
      <Stack
        px={3.5}
        spacing={1.5}
        alignItems={{ xs: 'flex-start' }}
        justifyContent="space-between"
      >
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
      </Stack>

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
      <Dialog open={open} onClose={closeConfirmModal}>
        <DialogTitle>Transactions Details</DialogTitle>
        <DialogContent>
          <div ref={printRef}>
            <Typography>Detail de la transaction</Typography>
            <Typography>Montant: {selectedTransaction?.montant} fcfa</Typography>
            <Typography>Utilisateur: {getUserById(selectedTransaction?.utilisateur_id || 0)}</Typography>
            <Typography>Vidéo: {getVideoById(selectedTransaction?.video_id || 0)}</Typography>
            <Typography>Date: {new Date(selectedTransaction?.created_at || '').toLocaleDateString()}</Typography>
            <Typography>Status: {selectedTransaction?.statut}</Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint} color="primary">
            Imprimer
          </Button>
          <Button onClick={closeConfirmModal} color="secondary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TransactionUser;
