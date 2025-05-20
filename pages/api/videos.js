
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 5,
        q: query,
        key: YOUTUBE_API_KEY
      }
    });

    const videos = ytRes.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    const summarized = await Promise.all(videos.map(async (video) => {
      try {
        const aiRes = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: `Summarize the following content: ${video.description}` }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        return {
          ...video,
          summary: aiRes.data.choices[0].message.content.trim()
        };
      } catch (err) {
        return { ...video, summary: 'Error generating summary.' };
      }
    }));

    res.status(200).json(summarized);
  } catch (error) {
    console.error('API error:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching videos' });
  }
}
