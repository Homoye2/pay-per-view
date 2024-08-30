import React from 'react';
import Grid from '@mui/material/Grid';

import SerieList from '../../components/video/serie/SerieList';


const Serie: React.FC = () => {
  return(
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      <Grid item xs={12}>
        <SerieList />
      </Grid>
    </Grid>
  );
};

export default Serie;
