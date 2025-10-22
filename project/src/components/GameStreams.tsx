// components/GameStreams.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Stream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  thumbnail_url: string;
  user?: {
    id: string;
    login: string;
    display_name: string;
    profile_image_url: string;
  };
}

interface GameStreamsProps {
  gameName: string;
  limit?: number;
}

const GameStreams: React.FC<GameStreamsProps> = ({ gameName, limit = 8 }) => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/twitch/streams`, {
          params: {
            game: gameName,
            limit: limit,
          },
        });
        
        setStreams(response.data.streams);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch streams');
      } finally {
        setLoading(false);
      }
    };

    if (gameName) {
      fetchStreams();
    }
  }, [gameName, limit]);

  if (loading) {
    return (
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4">Live Streams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="bg-gray-700 h-40 rounded mb-2"></div>
              <div className="bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-700 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4">Live Streams</h3>
        <div className="text-red-400">Error loading streams: {error}</div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4">Live Streams</h3>
        <div className="text-gray-400">No live streams found for {gameName}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Live Streams</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {streams.map((stream) => (
          <a
            key={stream.id}
            href={`https://twitch.tv/${stream.user_login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
          >
            <div className="relative">
              <img
                src={stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180')}
                alt={stream.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                LIVE
              </div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {stream.viewer_count.toLocaleString()} viewers
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center space-x-2 mb-2">
                {stream.user?.profile_image_url && (
                  <img
                    src={stream.user.profile_image_url}
                    alt={stream.user_name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="font-semibold text-white truncate">
                  {stream.user_name}
                </span>
              </div>
              <p className="text-gray-300 text-sm line-clamp-2">{stream.title}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GameStreams;