#!/usr/bin/env node

import express from 'express'
import type { Request, Response } from 'express'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMCPServer } from './src/server'

const app = express()
app.use(express.json())

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'superthread-mcp',
    version: '1.0.0',
    authentication: 'Bearer token required in Authorization header',
  })
})

// MCP endpoint
app.post('/mcp', async (req: Request, res: Response) => {
  // Extract authorization token from header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      jsonrpc: '2.0',
      error: {
        code: -32001,
        message: 'Authorization header with Bearer token is required',
      },
      id: null,
    })
  }

  const token = authHeader.substring(7) // Remove "Bearer " prefix

  try {
    const server = createMCPServer(token)
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    })

    res.on('close', () => {
      console.log('Request closed')
      transport.close()
      server.close()
    })

    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    console.error('Error handling MCP request:', error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      })
    }
  }
})

async function main() {
  // Start the server
  const PORT = process.env.PORT || 3000

  const server = app.listen(PORT, () => {
    console.log(`Superthread MCP HTTP Server listening on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/health`)
    console.log(`MCP endpoint: http://localhost:${PORT}/mcp`)
  })

  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('\nShutting down server...')
    server.close(() => {
      console.log('Server shut down gracefully')
      process.exit(0)
    })
  })

  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, shutting down server...')
    server.close(() => {
      console.log('Server shut down gracefully')
      process.exit(0)
    })
  })

  // Keep the process alive
  const keepAlive = setInterval(() => {}, 1000)

  // Return a promise that resolves when server closes
  return new Promise((resolve) => {
    server.on('close', () => {
      clearInterval(keepAlive)
      resolve(undefined)
    })
  })
}

main().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
