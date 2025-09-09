# Superthread MCP Server

An unofficial Model Context Protocol (MCP) server for integrating with the [Superthread](https://superthread.com) API. This server provides tools for managing users, cards, projects, and boards in Superthread through Claude and other MCP-compatible clients.

## Available tools

### User management

- [x] `get_me` - Get information about the current user.
- [x] `update_me` - Update information about the current user.
- [ ] `get_team_members` - Get information about team members.

### Card management

- [x] `create_card` - Create a new card.
- [x] `get_card` - Get information about a card.
- [ ] `get_assigned_cards` - Get cards assigned to a user.
- [x] `update_card` - Update information about a card.
- [x] `delete_card` - Delete a card.
- [ ] `archive_card` - Archive a card.

### Project management

- [ ] `create_project` - Create a new project.
- [x] `get_project` - Get information about a project.
- [ ] `list_projects` - List projects.
- [ ] `update_project` - Update information about a project.
- [ ] `delete_project` - Delete a project.
- [ ] `archive_project` - Archive a project.

### Pages

- [ ] `create_page` - Create a new page.
- [ ] `get_page` - Get information about a page.
- [ ] `list_pages` - List pages.
- [ ] `update_page` - Update information about a page.
- [ ] `delete_page` - Delete a page.
- [ ] `archive_page` - Archive a page.

### Comments

- [ ] `create_comment` - Create a new comment.
- [ ] `get_comment` - Get information about a comment.
- [ ] `get_replies` - Get replies to a comment.
- [ ] `reply_to_comment` - Reply to a comment.
- [ ] `edit_comment` - Edit a comment.
- [ ] `edit_reply` - Edit a reply.
- [ ] `delete_comment` - Delete a comment.
- [ ] `delete_reply` - Delete a reply.

### Board management

- [x] `create_board` - Create a new board.
- [x] `get_board` - Get information about a board.
- [x] `list_boards` - List boards.
- [x] `update_board` - Update information about a board.
- [x] `delete_board` - Delete a board.
- [ ] `archive_board` - Archive a board.
- [ ] `create_status` - Create a new status.
- [ ] `update_status` - Update information about a status.

### Spaces management

- [ ] `create_space` - Create a new space.
- [ ] `get_space` - Get information about a space.
- [ ] `list_spaces` - List spaces.
- [ ] `update_space` - Update information about a space.
- [ ] `delete_space` - Delete a space.

### MCP Client Integration

To use this server with Claude or another MCP client, configure it to connect to:
```
http://localhost:3000/mcp
```

Include your Superthread Personal Access Token in the Authorization header:
```
Authorization: Bearer YOUR_SUPERTHREAD_TOKEN
```

## Development

### Scripts
- `bun run dev` - Run in development mode
- `bun run build` - Build for production
- `bun run start` - Build and run
- `bun run test` - Run health check test

### Project Structure
```
src/
├── lib/           # Core utilities (API client, search)
├── tools/         # MCP tool implementations
├── types/         # TypeScript type definitions
└── server.ts      # MCP server setup
```

## Docker Support

A Dockerfile is included for containerized deployment:
```bash
docker build -t superthread-mcp .
docker run -p 3000:3000 superthread-mcp
```

## Requirements

- Node.js 22+ or Bun runtime
- Superthread Personal Access Token
- Network access to api.superthread.com

## License

This is an unofficial integration and is not affiliated with Superthread.
