// pages/api/videos.js

export default async function handler(req, res) {
  const { query } = req.query;

  if (!process.env.YOUTUBE_API_KEY || !process.env.OPENAI_API_KEY) {
    console.error("Missing API keys");
    return res.status(500).json({ message: "Missing API keys" });
  }

  try {
    const youtubeRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await youtubeRes.json();

    if (!data.items) {
      return res.status(500).json({ message: "YouTube API returned no results" });
    }

    const results = await Promise.all(
      data.items
        .filter((item) => item.id.videoId)
        .map(async (item) => {
          const summaryRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "user",
                  content: `Summarize this video description in 2 sentences:\n${item.snippet.description}`
                }
              ]
            })
          });

          const summaryJson = await summaryRes.json();
          const summary = summaryJson.choices?.[0]?.message?.content || "No summary available.";

          return {
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            summary
          };
        })
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ message: "Error fetching videos" });
  }
}
