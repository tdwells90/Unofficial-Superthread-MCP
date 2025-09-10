import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerUserTools } from './tools/user.js'
import { registerCardTools } from './tools/cards.js'
import { registerProjectTools } from './tools/projects.js'
import { registerBoardTools } from './tools/boards.js'

export function createMCPServer(authToken: string): McpServer {
  const server = new McpServer(
    {
      name: 'superthread-mcp',
      title: 'Superthread',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        logging: {},
      },
    }
  )

  // Register all tools
  registerUserTools(server, authToken)
  registerCardTools(server, authToken)
  registerProjectTools(server, authToken)
  registerBoardTools(server, authToken)

  return server
}
