import React from 'react';

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();

  // Already a plain ID (11 chars, alphanumeric + dash/underscore)
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    // youtu.be/VIDEO_ID
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0];
    }

    // youtube.com/watch?v=VIDEO_ID
    const v = url.searchParams.get('v');
    if (v) return v;

    // youtube.com/embed/VIDEO_ID or youtube.com/v/VIDEO_ID
    const embedMatch = url.pathname.match(/\/(?:embed|v)\/([\w-]+)/);
    if (embedMatch) return embedMatch[1];
  } catch {
    // Not a valid URL, return as-is
  }

  return trimmed;
}

interface VideoProps {
  youtubeId: string;
  aspectRatio?: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1';
  className?: string;
}

const Video: React.FC<VideoProps> = ({
  youtubeId: rawYoutubeId,
  aspectRatio = 'Ratio 16/9',
  className = '',
}) => {
  const youtubeId = extractYoutubeId(rawYoutubeId);
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
