import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id?: number;  // Assurez-vous que l'ID est de type number
  nom: string;
  prenom: string;
  email: string;
  date: string;
  statut: string;
  contact: string;
  pays: string;
}

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/utilisateurs', {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setUsers(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return users;
};

export default useUsers;
