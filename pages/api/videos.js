// pages/api/videos.js

export default async function handler(req, res) {
  const { query } = req.query;

  if (!process.env.YOUTUBE_API_KEY || !process.env.OPENAI_API_KEY) {
    console.error("❌ Missing API keys");
    return res.status(500).json({ message: "Missing API keys" });
  }
  
  const data = await youtubeRes.json();
console.log("🔍 YouTube API response:", JSON.stringify(data, null, 2));


  try {
    // 1. Fetch videos from YouTube API
    const youtubeRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${process.env.YOUTUBE_API_KEY}`
    );
    const data = await youtubeRes.json();

    // 2. Check for items
    if (!data.items || data.items.length === 0) {
      console.warn("⚠️ No videos returned from YouTube:", data);
      return res.status(200).json([]);
    }

    // 3. Generate summaries for each video
    const results = await Promise.all(
      data.items.map(async (item) => {
        const { title, description } = item.snippet;
        const videoId = item.id.videoId;

        let summary = "No summary available.";
        try {
          const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
                  content: `Summarize this video description in 2 sentences:\n${description}`
                }
              ]
            })
          });

          const summaryData = await openaiRes.json();

          if (summaryData?.choices?.[0]?.message?.content) {
            summary = summaryData.choices[0].message.content;
          } else {
            console.warn("⚠️ OpenAI returned no summary:", summaryData);
          }
        } catch (err) {
          console.error("❌ Error calling OpenAI:", err);
        }

        return {
          id: videoId,
          title,
          description,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          summary
        };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("❌ API route error:", err);
    res.status(500).json({ message: "Error fetching or processing video data." });
  }
}
