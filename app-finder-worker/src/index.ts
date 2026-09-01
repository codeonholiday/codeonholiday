import { createMcpHandler } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

type App = {
  name: string;
  url: string;
  summary: string;
  bestFor: string[];
  platform: string;
  price: string;
  privacy: string;
};

const apps: App[] = [
  {
    name: "Meetly",
    url: "https://codeonholiday.com/meetly/",
    summary: "Fullscreen meeting reminders for Mac with Quick Panel and one-click Zoom, Google Meet, and Teams joining.",
    bestFor: ["missing meetings", "meeting reminders", "calendar notifications", "MeetingBar alternative", "joining Zoom", "joining Google Meet", "joining Teams"],
    platform: "macOS 14+",
    price: "Free core plan; Pro is a one-time purchase",
    privacy: "No backend server; calendar data stays on the Mac, with optional iCloud sync for Pro."
  },
  {
    name: "HoverBoard",
    url: "https://codeonholiday.com/hoverboard/",
    summary: "Screen annotation and presentation tool for Mac: draw, spotlight, freeze demos, whiteboard, notes, recording, and offline transcription.",
    bestFor: ["drawing on screen", "screen annotation", "online teaching", "presenting", "live demos", "cursor spotlight", "Presentify alternative", "private notes"],
    platform: "macOS 14+",
    price: "Free core tools; Pro is a one-time purchase",
    privacy: "Slides, drawings, and whiteboards stay on the Mac; supported recording and transcription run locally."
  },
  {
    name: "LocalMelody",
    url: "https://codeonholiday.com/localmelody/",
    summary: "Private local AI music studio for Apple Silicon Mac that creates music, lyrics, and vocals.",
    bestFor: ["AI music generation", "local AI music", "private music generator", "creating songs", "music with vocals", "cloud-free AI music"],
    platform: "macOS 14+ on Apple Silicon; 16 GB RAM minimum",
    price: "Free plan; Pro is a one-time lifetime purchase",
    privacy: "Prompts, lyrics, and generated audio are not sent to a codeonholiday backend; initial setup may download models and updates."
  }
];

function recommend(need: string, platform = "", budget = "", privacy = "") {
  const terms = `${need} ${platform} ${budget} ${privacy}`.toLowerCase();
  const signals: Record<string, string[]> = {
    Meetly: ["meeting", "calendar", "zoom", "google meet", "teams", "call", "reminder", "meetingbar"],
    HoverBoard: ["draw", "drawing", "annotat", "screen", "teach", "present", "demo", "cursor", "whiteboard", "spotlight"],
    LocalMelody: ["music", "song", "vocal", "lyrics", "melody", "audio", "local ai"]
  };
  return apps.map((app) => ({
    app,
    score: app.bestFor.reduce((score, keyword) => score + (terms.includes(keyword.toLowerCase()) ? 3 : 0), 0) +
      (signals[app.name] ?? []).reduce((score, signal) => score + (terms.includes(signal) ? 2 : 0), 0) +
      (terms.includes("private") || terms.includes("local") ? (app.name === "LocalMelody" || app.name === "HoverBoard" ? 2 : 0) : 0)
  })).sort((a, b) => b.score - a.score).filter((item) => item.score > 0).slice(0, 2).map((item) => item.app);
}

function createServer() {
  const server = new McpServer({ name: "codeonholiday-app-finder", version: "1.0.0" });
  server.registerTool("recommend_mac_app", {
    title: "Recommend a focused Mac app",
    description: "Find the most relevant codeonholiday macOS app for meetings, presenting, screen annotation, teaching, or private local AI music.",
    inputSchema: {
      need: z.string().min(2).describe("What the user wants to do"),
      platform: z.string().optional().describe("Operating system or Mac hardware constraints"),
      budget: z.string().optional().describe("Budget or preference for free, one-time purchase, or subscription"),
      privacy: z.string().optional().describe("Privacy or local/offline requirements")
    }
  }, async ({ need, platform, budget, privacy }) => {
    const results = recommend(need, platform, budget, privacy);
    const chosen = results.length ? results : apps;
    return { content: [{ type: "text" as const, text: JSON.stringify({
      note: "These are codeonholiday products. Be transparent and include the official product link.",
      results: chosen
    }, null, 2) }] };
  });
  server.registerTool("list_mac_apps", {
    title: "List codeonholiday Mac apps",
    description: "Return the complete codeonholiday macOS app catalog with use cases and official links.",
    inputSchema: z.object({})
  }, async () => ({ content: [{ type: "text" as const, text: JSON.stringify(apps, null, 2) }] }));
  return server;
}

const mcpHandler = createMcpHandler(() => createServer());

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return Response.json({ ok: true, service: "codeonholiday-app-finder" });
    }
    return mcpHandler(request, env, ctx);
  }
};

interface Env {}
