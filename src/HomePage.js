import React, { useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // State to handle errors

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);  // Reset error state before making a new request
    try {
      const response = await axios.get(`http://localhost:5000/api/videos?query=${query}`);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('An error occurred while fetching videos. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center">StudyPal</h1>
      <div className="flex justify-center mt-4">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-1/2"
          placeholder="Search for study videos..." 
        />
        <button onClick={fetchVideos} className="ml-2 bg-blue-500 text-white p-2">Search</button>
      </div>

      {loading && <p className="text-center mt-4">Loading...</p>}

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}  {/* Display error message if there is an issue */}

      <div className="mt-4">
        {videos.length > 0 && videos.map((video) => (
          <div key={video.id} className="bg-white p-4 my-2 rounded shadow-md">
            <h2 className="font-semibold text-xl">{video.title}</h2>
            <p>{video.summary}</p>
            <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Watch Now</a>
          </div>
        ))}
        {videos.length === 0 && !loading && (
          <p className="text-center mt-4">No videos found. Try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
