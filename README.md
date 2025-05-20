# StudyPal 📚

StudyPal is a web application designed to help students and self-learners quickly find high-quality educational videos from YouTube. It combines search functionality with a large language model (LLM) from OpenAI to generate concise summaries of video content, improving learning efficiency.

---

## 🌟 Features

- 🔍 Search for videos by study topic
- 🎥 Fetch top 5 YouTube videos using YouTube Data API
- 🤖 Summarize video content using OpenAI's GPT-4o-mini
- 🎯 Filter and view results dynamically
- ⚡ Responsive and modern interface with TailwindCSS
- ✅ Deployed on [Vercel](https://vercel.com)

---

## 📱 Target Browsers

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile devices: iOS Safari, Android Chrome

---

## 🛠 Developer Manual

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

In your project root, create a `.env` file:

Alternatively, define these in Vercel's environment variable dashboard.

### 4. Run Locally

```bash
npm start
```

App will run on `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

---

## 🔌 API Endpoints

### `GET /api/videos?query=<search_term>`

Fetches educational videos from YouTube and returns them with LLM-generated summaries.

#### Response:

```json
[
  {
    "id": "abc123",
    "title": "Intro to Calculus",
    "description": "...",
    "url": "https://youtube.com/watch?v=abc123",
    "summary": "This video explains the basics of limits and derivatives..."
  }
]
```

---

## 🐞 Known Issues

- LLM summary quality may vary depending on YouTube video descriptions.
- API quota limits may apply (YouTube & OpenAI).

---

## 🔭 Roadmap

- ✅ Voice command integration
- ✅ Filter by video duration and ratings
- ⏳ Bookmark & history tracking
- ⏳ Multi-language summarization

---

## 👨‍💻 Authors

- Mike Brown

---

## 📄 License

MIT License
