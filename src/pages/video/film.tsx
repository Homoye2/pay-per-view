//import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import FilmList from '../../components/video/film/FilmList';
//import axios from 'axios';


const Film: React.FC = () => {

  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      <Grid item xs={12}>
        <FilmList  />
      </Grid>
    </Grid>
  );
};

export default Film;
