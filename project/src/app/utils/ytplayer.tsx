import React from 'react';

interface YouTubePlayerProps {
    videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
    console.log(videoId)
    return (
        <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`} title="YouTube video player"
                allow="autoplay; encrypted-media; fullscreen;"
                
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default YouTubePlayer;
