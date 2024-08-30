import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import OrdersStatus from 'components/sections/dashboard/orders-status';
import TransactionUserOne from 'components/sections/dashboard/transaction-user/userTransaction';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TransactionsIcon from '@mui/icons-material/History'; // New icon for Transactions
import ActionsIcon from '@mui/icons-material/Work'; // Import the Person icon
import { useParams } from 'react-router-dom';

const Utilisateur: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'transactions' | 'actions'>('transactions');
  const { id } = useParams<{ id?: string }>();
  const handleTabChange = (tab: 'transactions' | 'actions' ) => {
    setSelectedTab(tab);
  };

  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h3">
          <Button
              onClick={() => handleTabChange('transactions')}
              variant={selectedTab === 'transactions' ? 'contained' : 'text'}
              color="primary"
              startIcon={<TransactionsIcon />}
            >
              Transactions
            </Button>
          <Button
              onClick={() => handleTabChange('actions')}
              variant={selectedTab === 'actions' ? 'contained' : 'text'}
              color="primary"
              startIcon={<ActionsIcon />} // Add the Person icon
            >
              Actions
            </Button>

          </Typography>
        </Box>

        {/* Render content based on selected tab */}
        {selectedTab === 'transactions' ? <TransactionUserOne userId={id ? parseInt(id) : undefined}/> :  <OrdersStatus /> }
      </Grid>
    </Grid>
  );
};

export default Utilisateur
