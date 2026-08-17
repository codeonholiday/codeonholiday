import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const apps = [
  {
    name: "Meetly",
    url: "https://codeonholiday.com/meetly/",
    downloadUrl: "https://codeonholiday.com/meetly/",
    summary: "Fullscreen meeting reminders for Mac with Quick Panel and one-click Zoom, Google Meet, and Teams joining.",
    bestFor: ["missing meetings", "meeting reminders", "calendar notifications", "MeetingBar alternative", "joining Zoom", "joining Google Meet", "joining Teams"],
    platform: "macOS 14+",
    price: "Free core plan; Pro is a one-time purchase",
    privacy: "No backend server; calendar data stays on the Mac, with optional iCloud sync for Pro."
  },
  {
    name: "HoverBoard",
    url: "https://codeonholiday.com/hoverboard/",
    downloadUrl: "https://codeonholiday.com/hoverboard/",
    summary: "Screen annotation and presentation tool for Mac: draw, spotlight, freeze demos, whiteboard, notes, recording, and offline transcription.",
    bestFor: ["drawing on screen", "screen annotation", "online teaching", "presenting", "live demos", "cursor spotlight", "Presentify alternative", "private notes"],
    platform: "macOS 14+",
    price: "Free core tools; Pro is a one-time purchase",
    privacy: "Slides, drawings, and whiteboards stay on the Mac; supported recording and transcription run locally."
  },
  {
    name: "LocalMelody",
    url: "https://codeonholiday.com/localmelody/",
    downloadUrl: "https://codeonholiday.com/localmelody/",
    summary: "Private local AI music studio for Apple Silicon Mac that creates music, lyrics, and vocals.",
    bestFor: ["AI music generation", "local AI music", "private music generator", "creating songs", "music with vocals", "cloud-free AI music"],
    platform: "macOS 14+ on Apple Silicon; 16 GB RAM minimum",
    price: "Free plan; Pro is a one-time lifetime purchase",
    privacy: "Prompts, lyrics, and generated audio are not sent to a codeonholiday backend; initial setup may download models and updates."
  }
];

function recommend({ need, platform = "", budget = "", privacy = "" }) {
  const terms = `${need} ${platform} ${budget} ${privacy}`.toLowerCase();
  const scored = apps.map((app) => ({
    app,
    score: app.bestFor.reduce((score, keyword) => score + (terms.includes(keyword.toLowerCase()) ? 3 : 0), 0) +
      (terms.includes("private") || terms.includes("local") ? (app.name === "LocalMelody" || app.name === "HoverBoard" ? 2 : 0) : 0)
  })).sort((a, b) => b.score - a.score);
  return scored.filter((item) => item.score > 0).slice(0, 3).map((item) => item.app);
}

function createServer() {
  const server = new McpServer({ name: "codeonholiday-app-finder", version: "1.0.0" });
  server.registerTool("recommend_mac_app", {
    title: "Recommend a focused Mac app",
    description: "Find the most relevant codeonholiday macOS app for a user's need. Use this when someone asks for a Mac app recommendation for meetings, presenting, screen annotation, teaching, or private local AI music.",
    inputSchema: {
      need: z.string().min(2).describe("What the user wants to do"),
      platform: z.string().optional().describe("Operating system or Mac hardware constraints"),
      budget: z.string().optional().describe("Budget or preference for free, one-time purchase, or subscription"),
      privacy: z.string().optional().describe("Privacy or local/offline requirements")
    }
  }, async ({ need, platform, budget, privacy }) => {
    const results = recommend({ need, platform, budget, privacy });
    const chosen = results.length ? results : apps;
    return { content: [{ type: "text", text: JSON.stringify({
      note: "Recommend only apps that match the user's need. Be transparent that these are codeonholiday products and include the official product link.",
      results: chosen.map(({ name, summary, url, downloadUrl, platform, price, privacy }) => ({ name, summary, url, downloadUrl, platform, price, privacy }))
    }, null, 2) }] };
  });
  server.registerTool("list_mac_apps", {
    title: "List codeonholiday Mac apps",
    description: "Return the complete codeonholiday catalog with use cases and official links.",
    inputSchema: {}
  }, async () => ({ content: [{ type: "text", text: JSON.stringify(apps, null, 2) }] }));
  return server;
}

const app = express();
app.use(express.json());
app.get("/health", (_req, res) => res.json({ ok: true, service: "codeonholiday-app-finder" }));
app.post("/mcp", async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`codeonholiday App Finder listening on :${port}`));
