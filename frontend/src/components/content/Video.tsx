import React from 'react';

interface VideoProps {
  youtubeId: string;
  title?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1';
}

const Video: React.FC<VideoProps> = ({
  youtubeId,
  title,
  aspectRatio = '16/9',
}) => {
  const ratioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      )}
      <div className={`w-full ${ratioClass[aspectRatio]} rounded-xl overflow-hidden shadow-lg`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Video;
