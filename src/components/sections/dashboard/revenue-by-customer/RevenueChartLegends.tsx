import { useState } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import RevenueChartLegend from './RevenueChartLegend';
import { Box } from '@mui/material';

interface LegendsProps {
  chartRef: React.RefObject<EChartsReactCore>;
  revenueData: {
    categories: string[];
    series: { name: string; data: number[] }[];
  };
  sm?: boolean;
}

const legendsData = [
  {
    id: 1,
    type: 'Series Vendus',
  },
  {
    id: 2,
    type: 'Evenements Vendus',
  },
  {
    id: 3,
    type: 'Films Vendus',
  },
];

type ToggleColorState = {
  seriesvendu: boolean;
  evenementsvendu: boolean;
  filmsvendu: boolean;
};

const RevenueChartLegends = ({ chartRef, revenueData, sm }: LegendsProps) => {
  const [toggleColor, setToggleColor] = useState<ToggleColorState>({
    seriesvendu: true,
    evenementsvendu: true,
    filmsvendu: true,
  });

  const handleLegendToggle = (seriesName: string) => {
    const echartsInstance = chartRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    const key = seriesName.replace(' ', '').toLowerCase() as keyof ToggleColorState;

    setToggleColor((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    const option = echartsInstance.getOption() as echarts.EChartsOption;

    if (Array.isArray(option.series)) {
      const series = option.series.map((s) => {
        if (s.name === seriesName && s.type === 'bar') {
          const isBarVisible = (s.data as number[]).some((value) => value !== 0);
          return {
            ...s,
            data: isBarVisible
              ? (s.data as number[]).map(() => 0)
              : revenueData.series.find((s) => s.name === seriesName)?.data || [],
          };
        }
        return s;
      });
      echartsInstance.setOption({ series });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: sm ? 'row' : 'column',
        alignItems: sm ? 'center' : 'flex-start',
        justifyContent: sm ? 'center' : 'flex-start',
        paddingTop: sm ? 2 : 0,
        width: '100%',
        gap: sm ? 2 : 1,
      }}
    >
      {legendsData.map((item) => (
        <Box
          key={item.id}
          sx={{
            margin: sm ? 0 : '0 1px',
            display: 'flex',
            alignItems: 'center',
            gap: sm ? 1 : 2,
          }}
        >
          <RevenueChartLegend
            data={item}
            toggleColor={toggleColor}
            handleLegendToggle={handleLegendToggle}
          />
        </Box>
      ))}
    </Box>
  );
};

export default RevenueChartLegends;
