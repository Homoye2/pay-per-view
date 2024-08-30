//import { useState } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import { formatNumber } from 'functions/formatNumber';
// import axios from 'axios';
// interface User{
//     id?: string;
//     nom: string;
//     prenom: string;
//     email: string;
//     date:string;
//     statut:string;
//     contact: string;
//     pays: string;
// };

// const [user ,setUser]= useState<User>({
//     id: '',
//     nom: '',
//     prenom: '',
//     email: '',
//     date:'',
//     statut:'',
//     contact: '',
//     pays: '',
// });
// const getalluser  = async()=>{
//     try {

//         const response = await axios.get(`http://localhost:8000/api/listadministrateur/`, {
//           headers: {
//             'Content-Type': 'application/json',
//             'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
//           },
//         });
//         console.log(response.data);
//         setUser(response.data)
//       } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//           console.error('Error details:', error.response.data);
//         } else {
//           console.error('Unexpected error:', error);
//         }
//       }

// }



export const ordersStatusData: GridRowsProp = [
  {
    id: '#1529',
    client: { name: 'John Carter', email: 'hello@johncarter.com' },
    date: new Date('Jan 30, 2024'),
    status: 'delivered',
    country: 'United States',
    total: formatNumber(1099.24),
  },
  {
    id: '#1531',
    client: { name: 'Sophie Moore', email: 'contact@sophiemoore.com' },
    date: new Date('Jan 27, 2024'),
    status: 'canceled',
    country: 'United Kingdom',
    total: formatNumber(5870.32),
  },
  {
    id: '#1530',
    client: { name: 'Matt Cannon', email: 'info@mattcannon.com' },
    date: new Date('Jan 24, 2024'),
    status: 'delivered',
    country: 'Australia',
    total: formatNumber(13899.48),
  },


];


/*
import { useState, useEffect } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import { formatNumber } from 'functions/formatNumber';
import axios from 'axios';

interface User {
    id?: string;
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
            const response = await axios.get('http://localhost:8000/api/listadministrateur/', {
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

export const OrdersStatus = () => {
    const users = useUsers();

    const ordersStatusData: GridRowsProp = users.map((user) => ({
        id: user.id,
        client: { name: `${user.nom} ${user.prenom}`, email: user.email },
        date: new Date(user.date),
        status: user.statut,
        country: user.pays,
        total: formatNumber(1099.24), // Vous pouvez ajuster cela selon vos besoins
    }));

    return (
        <div>
            {ordersStatusData.map((order) => (
                <div key={order.id}>
                    <p>{order.client.name}</p>
                    <p>{order.client.email}</p>
                    <p>{order.date.toString()}</p>
                    <p>{order.status}</p>
                    <p>{order.country}</p>
                    <p>{order.total}</p>
                </div>
            ))}
        </div>
    );
};
*/
