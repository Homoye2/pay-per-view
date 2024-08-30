import { SxProps, useTheme } from '@mui/material';
import { fontFamily } from 'theme/typography';
import { useMemo, useState, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { PolarComponent, TooltipComponent, GraphicComponent } from 'echarts/components';
import ReactEchart from 'components/base/ReactEchart';
import EChartsReactCore from 'echarts-for-react/lib/core';
import Box from '@mui/material/Box';
import axios from 'axios';

echarts.use([PolarComponent, TooltipComponent, GraphicComponent, BarChart, CanvasRenderer]);

interface CardData {
  type: string;
  value: number;
}

const initialCardsData: CardData[] = [
  { type: 'Admin', value: 0 },
  { type: 'Utilisateur', value: 0 },

];

interface PolarBarChartProps {
  chartRef: React.RefObject<EChartsReactCore>;
  sx?: SxProps;
}

const VisitorsChart = ({ chartRef, ...rest }: PolarBarChartProps) => {
  const theme = useTheme();
  const [cardsData, setCardsData] = useState<CardData[]>(initialCardsData);

  const option = useMemo(
    () => ({
      polar: {
        radius: ['40%', '75%'], // Adjust the radius for responsiveness
      },
      angleAxis: {
        max: 100,
        startAngle: 180,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      radiusAxis: {
        show: false,
        type: 'category',
        data: cardsData.map(card => card.type),
      },
      tooltip: {},
      series: [
        {
          type: 'bar',
          data: cardsData.map(card => ({
            type: card.type,
            value: card.value,
            itemStyle: {
              color: card.type === 'Admin' ? theme.palette.secondary.main : theme.palette.secondary.lighter,
            },
          })),
          coordinateSystem: 'polar',
          barCategoryGap: '35%',
          label: {
            show: false,
          },
        },
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'center', // Center the text both horizontally and vertically
          style: {
            text: `${cardsData.reduce((sum, card) => sum + card.value, 0)}`,
            fill: theme.palette.text.primary,
            fontSize: theme.typography.h5.fontSize,
            fontFamily: fontFamily.workSans,
            fontWeight: 400,
            letterSpacing: 1,
          },
        },
      ],
    }),
    [theme, cardsData],
  );

  const fetchCounts = async () => {
    try {
      const adminResponse = await axios.get('http://localhost:8000/api/count-administrateur');
      const userResponse = await axios.get('http://localhost:8000/api/count-utilisateur');

      setCardsData([
        { type: 'Admin', value: adminResponse.data },
        { type: 'Utilisateur', value: userResponse.data },

      ]);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <Box
      sx={{
        width: '60%',
        height: '60%',
        position: 'relative', // Ensure chart container adapts to its parent
      }}
    >
      <ReactEchart ref={chartRef} echarts={echarts} option={option} {...rest} />
    </Box>
  );
};

export default VisitorsChart;
