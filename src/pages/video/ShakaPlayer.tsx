/*import React, { useEffect, useRef } from 'react';
import * as shaka from 'shaka-player/dist/shaka-player.compiled';

interface ShakaPlayerProps {
  src: string;
}

const ShakaPlayer: React.FC<ShakaPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const player = new shaka.Player(videoRef.current);

    player.load(src).catch((error: Error) => {
      console.error('Error loading video', error);
    });

    return () => {
      player.destroy();
    };
  }, [src]);

  return <video ref={videoRef} controls style={{ width: '100%' }} />;
};

export default ShakaPlayer;

*/
