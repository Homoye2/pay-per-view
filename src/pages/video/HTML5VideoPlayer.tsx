import React from 'react';

interface HTML5VideoPlayerProps {
  src: string;
}

const HTML5VideoPlayer: React.FC<HTML5VideoPlayerProps> = ({ src }) => {
  return (
    <video width="100%" controls>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default HTML5VideoPlayer;
