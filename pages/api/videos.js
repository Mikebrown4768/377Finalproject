export default async function handler(req, res) {
  console.log("API HIT: /api/videos");
  console.log("YouTube Key:", !!process.env.YOUTUBE_API_KEY);
  console.log("OpenAI Key:", !!process.env.OPENAI_API_KEY);

  res.status(200).json({
    message: "Serverless API is working",
    youtubeKeyPresent: !!process.env.YOUTUBE_API_KEY,
    openaiKeyPresent: !!process.env.OPENAI_API_KEY
    
  });
}