import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import VisitorsChartLegend from './VisitorsChartLegend';
import EChartsReactCore from 'echarts-for-react/lib/core';
import axios from 'axios';

interface LegendsProps {
  chartRef: React.RefObject<EChartsReactCore>;
}

interface legendsData {
  type: string;
  value: number;
}

export const InitiallegendsData: legendsData[] = [
  {
    type: 'Utilisateur',
    value: 0,
  },
  {
    type: 'Admin',
    value: 0,
  },
];

const VisitorsChartLegends = ({ chartRef }: LegendsProps) => {
  const theme = useTheme();
  const [toggleColor, setToggleColor] = useState({
    utilisateur: true,
    admin: true,
  });
  const [legendsData, setLegendsData] = useState<legendsData[]>(InitiallegendsData);

  const fetchCounts = async () => {
    try {
      const adminResponse = await axios.get('http://localhost:8000/api/count-administrateur');
      const userResponse = await axios.get('http://localhost:8000/api/count-utilisateur');

      setLegendsData([
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

  useEffect(() => {
    const handleBodyClick = (e: MouseEvent) => {
      handleToggleLegend(e as unknown as React.MouseEvent, null);
    };
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  const getActiveColor = (type: string) => {
    if (type === 'Utilisateur') {
      return theme.palette.secondary.lighter;
    } else if (type === 'Admin') {
      return theme.palette.secondary.main;
    }
  };

  const getDisableColor = (type: string) => {
    if (type === 'Utilisateur') {
      return theme.palette.secondary.darker;
    } else if (type === 'Admin') {
      return theme.palette.secondary.dark;
    }
  };

  const handleToggleLegend = (e: React.MouseEvent, type: string | null) => {
    e.stopPropagation();
    const echartsInstance = chartRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    const option = echartsInstance.getOption() as echarts.EChartsOption;

    if (type === 'Utilisateur') {
      setToggleColor({ utilisateur: true, admin: false });
    } else if (type === 'Admin') {
      setToggleColor({ utilisateur: false, admin: true });
    } else {
      setToggleColor({ utilisateur: true, admin: true });
    }

    if (Array.isArray(option.series)) {
      const series = option.series.map((s) => {
        if (Array.isArray(s.data)) {
          s.data.forEach((item) => {
            if (type !== null && item.itemStyle && item.itemStyle.color) {
              if (type === item.type) {
                item.itemStyle.color = getActiveColor(item.type);
              } else {
                item.itemStyle.color = getDisableColor(item.type);
              }
            } else {
              item.itemStyle.color = getActiveColor(item.type);
            }
          });
        }
        return s;
      });

      echartsInstance.setOption({ series });
    }
  };

  return (
    <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexDirection: 'row' }}>
      {legendsData.map((legend) => (
        <VisitorsChartLegend
          key={legend.type}
          data={legend}
          toggleColor={toggleColor}
          handleToggleLegend={handleToggleLegend}
        />
      ))}
    </div>
  );
};

export default VisitorsChartLegends;
