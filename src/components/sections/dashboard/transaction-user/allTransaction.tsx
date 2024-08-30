import { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
  id?: number;  // Assurez-vous que l'ID est de type number
  montant: number;
  utilisateur_id: number;
  video_id: number;
  statut: string;

}

const allTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getAllTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/transactions', {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setTransactions(response.data);
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  return transactions;
};

export default allTransaction;
