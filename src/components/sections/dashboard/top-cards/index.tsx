import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { FaTruckMoving, FaShoppingBag, FaFilm, FaMoneyBillAlt } from 'react-icons/fa';
import { IconType } from 'react-icons';
import axios from 'axios';

const iconMap: Record<string, IconType> = {
  'carbon:moving': FaTruckMoving,
  'solar:bag-bold': FaShoppingBag,
  'ph:bag-simple-fill': FaFilm,
  'mingcute:currency-dollar-2-line': FaMoneyBillAlt,
};

type IconKey = keyof typeof iconMap;

interface CardData {
  id: number;
  title: string;
  value: string;
  isUp: boolean;
  icon: IconKey;
}

const initialCardsData: CardData[] = [
  {
    id: 1,
    title: 'Videos Enrégistrées',
    value: '0', // Initial value will be updated dynamically
    isUp: true,
    icon: 'carbon:moving',
  },
  {
    id: 2,
    title: 'Series',
    value: '0',
    isUp: false,
    icon: 'ph:bag-simple-fill',
  },
  {
    id: 3,
    title: 'Films',
    value: '0',
    isUp: true,
    icon: 'ph:bag-simple-fill',
  },
  {
    id: 4,
    title: 'Evenements',
    value: '0',
    isUp: true,
    icon: 'mingcute:currency-dollar-2-line',
  },
];

const TopCard = ({ title, value, icon }: Omit<CardData, 'id'> & { icon: IconKey }) => {
  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    return null;
  }

  return (
    <Card>
      <CardContent style={{ padding: '10px' }}> {/* Adjust padding */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconComponent size={20} />
          <Typography style={{ fontSize: 10, marginLeft: '10px' }}>
            {title}
          </Typography>
        </div>
        <Typography style={{ fontSize: 10, marginLeft: '10px', marginTop: '10px' }}>{value}</Typography>
      </CardContent>
    </Card>
  );
};

const TopCards = () => {
  const [cardsData, setCardsData] = useState<CardData[]>(initialCardsData);

  const fetchCounts = async () => {
    try {
      const videoResponse = await axios.get('http://localhost:8000/api/count-video');
      const filmResponse = await axios.get('http://localhost:8000/api/count-film');
      const serieResponse = await axios.get('http://localhost:8000/api/count-serie');
      // Assume there's an API for event counts
      const evenementResponse = await axios.get('http://localhost:8000/api/count-evenement');

      setCardsData([
        { ...initialCardsData[0], value: videoResponse.data.toString() },
        { ...initialCardsData[1], value: serieResponse.data.toString() },
        { ...initialCardsData[2], value: filmResponse.data.toString() },
        { ...initialCardsData[3], value: evenementResponse.data.toString() },
      ]);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }} style={{ width: '100%' }}>
      {cardsData.map((item) => (
        <Grid item xs={4} sm={3} lg={3} key={item.id}>
          <TopCard
            title={item.title}
            value={item.value}
            isUp={item.isUp}
            icon={item.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
