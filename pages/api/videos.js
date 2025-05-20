export default async function handler(req, res) {
  const { query } = req.query;

  if (!process.env.YOUTUBE_API_KEY || !process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: "Missing API keys" });
  }
//This should work
  try {
    const youtubeRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${process.env.YOUTUBE_API_KEY}`
    );
    const data = await youtubeRes.json();

    if (!Array.isArray(data.items)) {
      console.warn("YouTube returned unexpected format:", data);
      return res.status(200).json({ message: "YouTube API error or no items." });
    }

    const results = await Promise.all(data.items.map(async (item) => {
      const { title, description } = item.snippet;
      const videoId = item.id.videoId;

      let summary = "No summary available.";
      try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: `Summarize this video description:
${description}` }]
          })
        });
        const summaryData = await openaiRes.json();
        summary = summaryData?.choices?.[0]?.message?.content || summary;
      } catch (e) {
        console.error("OpenAI error:", e);
      }

      return {
        id: videoId,
        title,
        description,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        summary
      };
    }));

    res.status(200).json(results);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}