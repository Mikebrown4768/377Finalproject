import React, { useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await axios.get(`/api/videos?query=${query}`);

      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
        setVideos([]);
        setError(response.data.message || 'Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error fetching videos:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred while fetching videos.');
      setVideos([]);
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center">StudyPal</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchVideos();
        }}
        className="flex justify-center mt-4"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-1/2"
          placeholder="Search for study videos..."
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white p-2">
          Search
        </button>
      </form>

      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      <div className="mt-4">
        {videos.length > 0 &&
          videos.map((video) => (
            <div key={video.id} className="bg-white p-4 my-2 rounded shadow-md">
              <h2 className="font-semibold text-xl">{video.title}</h2>
              <p>{video.summary}</p>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Watch Now
              </a>
            </div>
          ))}

        {hasSearched && videos.length === 0 && !loading && !error && (
          <p className="text-center mt-4">No videos found. Try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
