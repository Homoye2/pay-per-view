//import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
//import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

//import LogoImg from 'assets/images/Logo.png';

import ProfileMenu from './ProfileMenu';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  password: string;
}

interface TopbarProps {
  isClosing: boolean;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: { user: User | null; setUser: (user: User | null) => void };
}

const Topbar = ({ isClosing, mobileOpen, setMobileOpen, value }: TopbarProps) => {
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const { user, setUser } = value;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Toolbar sx={{ display: { xm: 'block', lg: 'none' }  }}>
          <IconButton size="medium" edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <IconifyIcon icon="mingcute:menu-line" />
          </IconButton>
        </Toolbar>



        <Typography
          variant="h5"
          fontWeight={600}
          letterSpacing={1}
          fontFamily="'Work Sans', sans-serif"
          style={{ display: 'block' }}
        >
          Pay Per View
        </Typography>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>


        <Tooltip title="Notifications">
          <IconButton size="large" style={{ color: 'text.secondary' }}>
            <IconifyIcon icon="ion:notifications" />
          </IconButton>
        </Tooltip>

        <ProfileMenu value={{ user, setUser }} />
      </div>
    </div>
  );
};

export default Topbar;
