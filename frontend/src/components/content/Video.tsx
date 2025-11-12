import React from 'react';

interface VideoProps {
  youtubeId: string;
  aspectRatio?: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1';
  className?: string;
}

const Video: React.FC<VideoProps> = ({
  youtubeId,
  aspectRatio = 'Ratio 16/9',
  className = '',
}) => {
  const ratioClass = {
    'Ratio 16/9': 'aspect-video',
    'Ratio 4/3': 'aspect-[4/3]',
    'Ratio 1/1': 'aspect-square',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${ratioClass[aspectRatio]} rounded-xl overflow-hidden shadow-lg`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Video;
