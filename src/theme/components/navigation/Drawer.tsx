import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Drawer: Components<Omit<Theme, 'components'>>['MuiDrawer'] = {
  styleOverrides: {
    root: {
      '&:hover, &:focus': {
        '*::-webkit-scrollbar, *::-webkit-scrollbar-thumb': {
          visibility: 'visible',
        },
      },
    },
    paper: ({ theme }) => ({
        padding: 0,
        width: '290px',
        height: '100vh',
        borderRadius: 0,
        border: 0,
        borderRight: '2px solid #800020',  // Ajouter la bordure rouge bordeaux ici
        borderTop: `10px solid ${theme.palette.info.main}`,
        borderBottom: `10px solid ${theme.palette.info.main}`,
        borderTopRightRadius: '100px',
        borderBottomRightRadius: '50px',
        backgroundColor: theme.palette.info.darker,
        boxShadow: theme.customShadows[0],
        boxSizing: 'border-box',
    }),
  },
};

export default Drawer;
