import { useState, useEffect } from 'react';
import axios from 'axios';

interface Video {
  id?: number;  // Assurez-vous que l'ID est de type number
  titre: string;
  description: string;
  categorie: string;
  prix: string;
  pathImage: string;
  statut: string;

}

const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  const getAllVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/videos', {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      setVideos(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return videos;
};

export default useVideos;
