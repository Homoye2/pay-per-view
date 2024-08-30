import { useRef } from 'react';
import { fontFamily } from 'theme/typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EChartsReactCore from 'echarts-for-react/lib/core';
import VisitorsChartLegends from './VisitorsChartLegends';
import VisitorsChart from './VisitorsChart';

const WebsiteVisitors = () => {
  const chartRef = useRef<EChartsReactCore>(null);

  return (
    <Paper
      sx={{
        p: 2,
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        boxShadow: 3,
        borderRadius: 12, // Adjust the borderRadius for a more subtle curve
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={400} // Adjust fontWeight for better readability
          fontFamily={fontFamily.workSans}
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, // Responsive font size
            textAlign: 'center', // Center text for better alignment
          }}
        >
          Visiteurs du site
        </Typography>
      </Box>

      {/* Polar bar chart */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Center the chart horizontally
          alignItems: 'center', // Center the chart vertically if height is fixed
          height: { xs: 200, sm: 120, md: 130 }, // Responsive chart height
          width:  '100%', // Use full width
          mb: 1, // Add some margin at the bottom for spacing

        }}
      >
        <Box
          sx={{
            width: '80%', // Ensure the chart takes up 80% of the container width
            maxWidth: 600,
             display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <VisitorsChart chartRef={chartRef} />
        </Box>
      </Box>

      {/* Legends */}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'row', // Ensure legends are displayed in a row
          flexWrap: 'wrap', // Allow legends to wrap on smaller screens
          justifyContent: 'center',
          gap: 1, // Space between legends
        }}
      >
        <VisitorsChartLegends chartRef={chartRef} />
      </Box>
    </Paper>
  );
};

export default WebsiteVisitors;
