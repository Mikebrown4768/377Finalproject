import axios from 'axios';

const fetchVideos = async (query) => {
  try {
    // Correctly use template literals without escape characters
    const response = await axios.get(`http://localhost:5000/api/videos?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos', error);
    return [];
  }
};

export default fetchVideos;
