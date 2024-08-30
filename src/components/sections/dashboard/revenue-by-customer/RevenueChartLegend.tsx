import { fontFamily } from 'theme/typography';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

interface LegendProps {
  data: {
    id: number;
    type: string;
  };
  toggleColor: {
    seriesvendu: boolean;
    evenementsvendu: boolean;
    filmsvendu: boolean;
  };
  handleLegendToggle: (seriesName: string) => void;
}

const RevenueChartLegend = ({ data, toggleColor, handleLegendToggle }: LegendProps) => {
  let color = '';

  if (toggleColor.seriesvendu && data.type === 'Series Vendus') {
    color = 'primary.main';
 } else if (toggleColor.evenementsvendu && data.type === 'Evenements Vendus') {
  color = 'secondary.light';
  } else if (toggleColor.filmsvendu && data.type === 'Films Vendus') {
    color = 'secondary.lighter';
  } else {
    color = 'text.secondary';
  }

  return (
    <ButtonBase
      onClick={() => handleLegendToggle(data.type)}
      disableRipple
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1, // Space between color box and text
        padding: '2px', // Padding for better touch targets on small screens
        transition: 'background-color 0.3s',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light background on hover
        },
        width: { xs: '80%', sm: 'auto' }, // Full width on small screens
        justifyContent: 'center', // Center items on small screens
      }}
    >
      <Box
        height={9} // Increased size for better visibility
        width={9} // Increased size for better visibility
        bgcolor={color}
        borderRadius="50%"
        sx={{
          display: 'inline-block',
          transition: 'background-color 0.3s',
        }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        fontFamily={fontFamily.workSans}
        sx={{
          fontSize: { xs: '0.5rem', sm: '0.5rem', md: '0.8rem' },
          textAlign: 'center',
          whiteSpace: 'nowrap', // Prevent text wrapping
          overflow: 'hidden', // Hide overflow text
          textOverflow: 'ellipsis', // Add ellipsis if text overflows
        }}
      >
        {data.type}
      </Typography>
    </ButtonBase>
  );
};

export default RevenueChartLegend;
