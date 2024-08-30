import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import OrdersStatus from 'components/sections/dashboard/orders-status';
import OrdersAdmin from 'components/sections/dashboard/order-admin';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person'; // Import the Person icon

const Utilisateur: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'administrators' | 'clients'>('administrators');

  const handleTabChange = (tab: 'administrators' | 'clients') => {
    setSelectedTab(tab);
  };

  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h3">
            <Button
              onClick={() => handleTabChange('administrators')}
              variant={selectedTab === 'administrators' ? 'contained' : 'text'}
              color="primary"
              startIcon={<PersonIcon />}
            >
              Administrateurs
            </Button>
            <Button
              onClick={() => handleTabChange('clients')}
              variant={selectedTab === 'clients' ? 'contained' : 'text'}
              color="primary"
              startIcon={<PersonIcon />} // Add the Person icon
            >
              Clients
            </Button>
          </Typography>
        </Box>

        {/* Render content based on selected tab */}
        {selectedTab === 'clients' ? <OrdersStatus /> : <OrdersAdmin />}
      </Grid>
    </Grid>
  );
};

export default Utilisateur;
