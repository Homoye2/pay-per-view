import { useRef, useEffect, useState  } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
//import RateChip from 'components/chips/RateChip';
//import DateSelect from 'components/dates/DateSelect';
import EChartsReactCore from 'echarts-for-react/lib/core';
import RevenueChartLegends from './RevenueChartLegends';
import RevenueChart from './RevenueChart';
import axios from 'axios';
//import styles from './RevenueByCustomer.module.css';

type RevenueDataItem = {
    annee: number;
    mois: number;
    categorie: string;
    total_ventes: string; // ou 'number' si les données sont déjà numériques
  };

const RevenueByCustomer = () => {
  const chartRef = useRef<EChartsReactCore>(null);
  const [revenueData, setRevenueData] = useState<{
    categories: string[];
    series: {
      name: string;
      data: number[];
    }[];
  }>({
    categories: [],
    series: [
      { name: 'Series Vendus', data: [] },
      { name: 'Films Vendus', data: [] },
      { name: 'Evenements Vendus', data: [] },
    ],
  });

  const fetchCounts = async () => {
    try {
      //const videoResponse = await axios.get('http://localhost:8000/api/count-video');
      const response = await axios.get<RevenueDataItem[]>('http://localhost:8000/api/somme-video-transactions');
      const data = response.data;

      // Transform data to fit your chart requirements
      const categories = [...new Set(data.map(item => `${item.annee}-${item.mois}`))];
      const series = [
        {
          name: 'Series Vendus',
          data: categories.map(cat =>
            data
              .filter(item => item.categorie === 'serie' && `${item.annee}-${item.mois}` === cat)
              .reduce((sum, item) => sum + parseFloat(item.total_ventes), 0)
          ),
        },
        {
          name: 'Films Vendus',
          data: categories.map(cat =>
            data
              .filter(item => item.categorie === 'film' && `${item.annee}-${item.mois}` === cat)
              .reduce((sum, item) => sum + parseFloat(item.total_ventes), 0)
          ),
        },
        {
          name: 'Evenements Vendus',
          data: categories.map(cat =>
            data
              .filter(item => item.categorie === 'evenement' && `${item.annee}-${item.mois}` === cat)
              .reduce((sum, item) => sum + parseFloat(item.total_ventes), 0)
          ),
        },
      ];

      setRevenueData({
        categories,
        series,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);


  useEffect(() => {
    fetchCounts();
  }, []);


  return (
    <Paper
      sx={{
        p: 2,
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        boxShadow: 3,
        borderRadius: 12,
      }}
    >
      {/* Header */}
      <Typography variant="h4" color="text.secondary" mb={2} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        Sondage des Revenus
      </Typography>

      {/* Legends and Metrics */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <RevenueChartLegends chartRef={chartRef} revenueData={revenueData} sm={true} />

      </Box>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'row',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <RevenueChartLegends chartRef={chartRef} revenueData={revenueData} sm={true} />

      </Box>

      {/* Chart */}
      <Box
        sx={{
          height: { xs: 200, md: 200 },
          minHeight: 1,
          width: '100%',
        }}
      >
        <RevenueChart chartRef={chartRef} data={revenueData} />
      </Box>
    </Paper>
  );
};

export default RevenueByCustomer;
