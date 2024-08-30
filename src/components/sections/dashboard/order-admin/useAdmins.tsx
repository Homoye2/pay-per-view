import { useState, useEffect } from 'react';
import axios from 'axios';

interface Admin {
  id?: number;  // Assurez-vous que l'ID est de type number
  nom: string;
  prenom: string;
  email: string;
  statut: string;

}

const useAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);

  const getAllAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/administrateurs', {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setAdmins(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    getAllAdmins();
  }, []);

  return admins;
};

export default useAdmins;
