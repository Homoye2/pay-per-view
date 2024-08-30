import { useState } from 'react';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';
import { useNavigate } from 'react-router-dom';
import paths from '../../../routes/paths';

interface MenuItems {
  id: number;
  title: string;
  icon: string;
}

const menuItems: MenuItems[] = [
  {
    id: 1,
    title: 'Profile',
    icon: 'mingcute:user-2-fill',
  },
  {
    id: 3,
    title: 'Notifications',
    icon: 'ion:notifications',
  },
  {
    id: 6,
    title: 'Déconnection',
    icon: 'material-symbols:logout',
  },
];

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  password: string;
}

interface ProfileProps {
  value: { user: User | null; setUser: (user: User | null) => void };
}

const ProfileMenu = ({ value }: ProfileProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, setUser } = value;

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <Tooltip title="Profile">
        <ButtonBase onClick={handleProfileClick} disableRipple>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
          >
            <Avatar
              src={user?.photo || 'path/to/default/avatar.png'}
              style={{
                marginLeft: '8px',
                height: '32px',
                width: '32px',
                backgroundColor: '#1976d2', // Assuming this is the primary color
              }}
            />
            <Typography variant="subtitle2">{user?.name || 'Guest'}</Typography>
          </div>
        </ButtonBase>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          style: {
            marginTop: '12px',
            padding: '0',
            width: '240px',
            overflow: 'hidden',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            '&:hover': { backgroundColor: '#e3f2fd' },
            paddingY: '8px',
          }}
        >
          <Avatar
            src={`http://localhost:8000/storage/${user?.photo}` || 'path/to/default/avatar.png'}
            sx={{
              bgcolor: 'primary.main',
              marginLeft: '-4px',
              marginRight: '8px',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" fontWeight={500}>
              {user?.name || 'John Doe'}
            </Typography>
            <Typography variant="caption" fontWeight={400} color="text.secondary">
              {user?.email || 'email@example.com'}
            </Typography>
          </div>
        </MenuItem>

        <Divider />

        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              if (item.title === 'Déconnection') {
                handleLogout();
              } else if (item.title === 'Profile') {
                navigate(paths.profile, { state: { user } });
              } else {
                handleProfileMenuClose();
              }
            }}
            sx={{ py: 1 }} // Using `sx` prop for padding
          >
            <ListItemIcon sx={{ mr: 2, fontSize: '20px' }}>
              <IconifyIcon icon={item.icon} />
            </ListItemIcon>
            <Typography variant="body2" color="text.secondary">
              {item.title}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ProfileMenu;
