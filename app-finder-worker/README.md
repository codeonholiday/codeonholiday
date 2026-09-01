# codeonholiday App Finder — Cloudflare Worker

Stateless remote MCP server for recommending Meetly, HoverBoard, and LocalMelody. It runs on Cloudflare's edge and does not need a traditional server or database.

## Deploy

```bash
cd app-finder-worker
npm install
npx wrangler login
npm run deploy
```

Cloudflare will print a URL similar to:

```text
https://codeonholiday-app-finder.<account>.workers.dev/mcp
```

Test the health endpoint at `/health`, then test `/mcp` using the MCP Inspector. The `/mcp` path is an MCP protocol endpoint; opening it directly in a browser is not expected to show a webpage.

## Custom domain

The Worker is configured to use:

```text
mcp.codeonholiday.com/mcp
```

Wrangler creates the Custom Domain and certificate during deploy. The existing GitHub Pages site remains at `codeonholiday.com`.
