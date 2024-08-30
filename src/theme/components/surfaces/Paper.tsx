import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Paper: Components<Omit<Theme, 'components'>>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
        padding: theme.spacing(3.5),
        backgroundColor: theme.palette.info.main,
        boxShadow: theme.customShadows[0],
        borderRadius: theme.shape.borderRadius * 2,

        position: 'relative',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50px',  // ajustez selon vos besoins
          height: '50px', // ajustez selon vos besoins
    

          zIndex: 1,
        },
    }),
  },
};

export default Paper;
