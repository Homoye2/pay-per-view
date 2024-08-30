import { useEffect, useState, PropsWithChildren } from 'react';
//import Stack from '@mui/material/Stack';
import Sidebar from 'layouts/main-layout/sidebar';
import Topbar from 'layouts/main-layout/topbar';
import Footer from './Footer';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  password: string;
}

const MainLayout = ({ children }: PropsWithChildren) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Use User type here

  useEffect(() => {
    // Récupérer les données utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
    <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} setIsClosing={setIsClosing} />
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        paddingLeft: '24px',
        paddingRight: '24px',
        width: 'calc(100% - 300px)',
        flexGrow: 1
      }}
    >
      <Topbar isClosing={isClosing} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} value={{ user, setUser }} />
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  </div>
  );
};

export default MainLayout;
