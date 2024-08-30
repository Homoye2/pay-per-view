import { fontFamily } from 'theme/typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

interface LegendProps {
  data: {
    type: string;
    value: number;
  };
  toggleColor: {
    utilisateur: boolean;
    admin: boolean;
  };
  handleToggleLegend: (e: React.MouseEvent<HTMLButtonElement>, type: string | null) => void;
}

const VisitorsChartLegend = ({ data, toggleColor, handleToggleLegend }: LegendProps) => {
  let color = '';

  if (toggleColor.utilisateur && data.type === 'Utilisateur') {
    color = 'primary.main';
  } else if (toggleColor.admin && data.type === 'Admin') {
    color = 'secondary.light';
  } else {
    color = 'text.secondary';
  }

  return (
    <Stack alignItems="center" justifyContent="space-between">
      <ButtonBase onClick={(e) => handleToggleLegend(e, data.type)} disableRipple>
        <Stack spacing={1} alignItems="center">
          <Box height={8} width={8} bgcolor={color} borderRadius={1} />
          <Typography variant="body1" color="text.secondary" fontFamily={fontFamily.workSans}>
            {data.type}
          </Typography>
        </Stack>
      </ButtonBase>
      <Typography variant="body1" color="text.primary" fontFamily={fontFamily.workSans}>
        {data.value}
      </Typography>
    </Stack>
  );
};

export default VisitorsChartLegend;
