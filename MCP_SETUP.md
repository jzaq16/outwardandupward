# Vercel MCP Server Setup

Vercel provides an official Model Context Protocol (MCP) server that allows your IDE (Cursor) to interact directly with your Vercel projects.

## Official Setup (Recommended)

The easiest way to set this up is through Vercel's official MCP portal.

1.  **Visit the Portal**: Go to [mcp.vercel.com](https://mcp.vercel.com).
2.  **Connect Account**: Log in with your Vercel account.
3.  **Add to Cursor**: Look for an "Add to Cursor" button or a similar "One-Click Setup" link. This will automatically configure your editor.

## Manual Configuration
If the automatic setup doesn't work, you may need to manually configure your `.cursor/mcp.json` file.

1.  **Open Settings**: Go to `File` > `Preferences` > `Cursor Settings` > `MCP`.
2.  **Edit Config**: You can add the server configuration manually. Since the official server is a hosted service, it typically requires an SSE (Server-Sent Events) connection rather than a local command.
    *   *Note: The exact URL and parameters are generated specifically for your account on the [mcp.vercel.com](https://mcp.vercel.com) dashboard.*

## Community Alternatives
If you prefer running a local server (e.g., for lower latency or offline development), you can use a community-maintained package:

**@robinson_ai_systems/vercel-mcp**
```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@robinson_ai_systems/vercel-mcp"],
      "env": {
        "VERCEL_API_TOKEN": "your-token-here"
      }
    }
  }
}
```
*Requires generating a [Vercel API Token](https://vercel.com/account/tokens).*
