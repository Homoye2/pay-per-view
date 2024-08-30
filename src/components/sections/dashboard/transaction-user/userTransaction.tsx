import React, { useState, useEffect, ChangeEvent } from 'react';
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

interface TransactionUserOneProps {
  userId?: number;
}

const TransactionUserOne: React.FC<TransactionUserOneProps> = ({ userId }) => {
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

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/transactions-user/${userId}`);
      setTransactions(response.data as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    `${transaction.montant} ${transaction.id} ${transaction.utilisateur_id}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const getUserById = (id: number): string => {
    const user = allUsers.find(user => user.id === id);
    return user ? ` [ ID: ${user.id} ] ${user.nom}  ${user.prenom}` : 'Unknown User';
  };

  const getVideoById = (id: number): string => {
    const video = allVideos.find(video => video.id === id);
    return video ? ` [ ID: ${video.id} ] ${video.titre}` : 'Unknown Video';
  };

  const ordersStatusData = filteredTransactions.map((transaction) => ({
    id: transaction.id,
    montant: `${transaction.montant} fcfa`,
    utilisateur: getUserById(transaction.utilisateur_id),
    video: getVideoById(transaction.video_id),
    date: new Date(transaction.created_at).toLocaleDateString(),
    status: `${transaction.statut}`,
  }));

  const handleView = (id: number) => {
    const transaction = transactions.find((transaction) => transaction.id === id);
    if (transaction) {
      setSelectedTransaction(transaction);
    }
    setOpen(true);
  };

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

  const closeConfirmModal = () => {
    setOpen(false);
  };

  const printTransactionDetails = () => {
    if (selectedTransaction) {
      const printWindow = window.open('', '', 'height=600,width=800');
      const content = `
        <html>
          <head>
            <title>Transaction Details</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { padding: 20px; }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                padding: 10px;
                border: 1px solid #ddd;
                text-align: left; /* Align text to the left */
              }
              th {
                background-color: #f4f4f4;
                text-align: center; /* Center the text in table headers */
                vertical-align: top; /* Align header cells at the top */
              }
              td {
                vertical-align: bottom; /* Align data cells at the bottom */
              }
              h1 {
                font-size: 24px;
                text-align: center;
                background-color: #d3d3d3; /* Light gray background */
                padding: 10px;
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Transaction Details | Abel-Digital</h1>
              <table>
                <tr>
                  <th>Montant</th>
                  <td>${selectedTransaction.montant} fcfa</td>
                </tr>
                <tr>
                  <th>Utilisateur</th>
                  <td>${getUserById(selectedTransaction.utilisateur_id || 0)}</td>
                </tr>
                <tr>
                  <th>Vidéo</th>
                  <td>${getVideoById(selectedTransaction.video_id || 0)}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>${new Date(selectedTransaction.created_at || '').toLocaleDateString()}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>${selectedTransaction.statut}</td>
                </tr>
              </table>
            </div>

          </body>
        </html>
      `;
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
      }
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
          label="View"
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
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          <Typography>Detail de la transaction</Typography>
          <Typography>Montant: {selectedTransaction?.montant} fcfa</Typography>
          <Typography>Utilisateur: {getUserById(selectedTransaction?.utilisateur_id || 0)}</Typography>
          <Typography>Vidéo: {getVideoById(selectedTransaction?.video_id || 0)}</Typography>
          <Typography>Date: {new Date(selectedTransaction?.created_at || '').toLocaleDateString()}</Typography>
          <Typography>Status: {selectedTransaction?.statut}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmModal} color="secondary">
            Fermer
          </Button>
          <Button onClick={printTransactionDetails} color="primary">
            Imprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TransactionUserOne;
