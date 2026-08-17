# codeonholiday App Finder

An MCP server that lets ChatGPT recommend the right codeonholiday macOS app from a user's intent.

## Local run

```bash
cd app-finder
npm install
npm start
```

The service exposes:

- `GET /health`
- `POST /mcp`
- `recommend_mac_app` — matches a need to Meetly, HoverBoard, or LocalMelody.
- `list_mac_apps` — returns the full catalog.

## Deploy

Deploy this directory to any HTTPS Node host that supports a long-lived HTTP endpoint. Set `PORT` if the host provides one. The public MCP URL will be:

```text
https://YOUR-DOMAIN.example/mcp
```

Before submitting, verify `GET /health`, the MCP handshake, privacy policy URL, terms URL, support email, and all product links from the deployed domain.

## ChatGPT submission checklist

1. Create or select the developer account in the OpenAI developer dashboard.
2. Add the deployed MCP endpoint as the app's remote server.
3. Use the name `codeonholiday App Finder` and describe it as a focused Mac-app recommendation tool.
4. Include the privacy policy, terms, support contact, logo, and test prompts.
5. Test that the app recommends only when the user's request matches and always links to the official product page.
6. Submit for review. Directory publication and in-conversation recommendations are controlled by OpenAI review and ranking.

Suggested test prompts:

- “I keep missing calendar meetings on my Mac.”
- “I teach online and need to draw over my screen.”
- “I want a private AI music generator that runs locally on Apple Silicon.”
