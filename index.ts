#!/usr/bin/env node

import cors from 'cors'
import express from 'express'
import { randomUUID } from 'node:crypto'
import type { Request, Response } from 'express'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { createMCPServer } from './src/server'

const app = express()
app.use(express.json())

// CORS configuration
app.use(
  cors({
    origin: '*',
    exposedHeaders: ['Mcp-Session-Id'],
    allowedHeaders: ['Content-Type', 'mcp-session-id'],
  })
)

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'superthread-mcp',
    version: '1.0.0',
    authentication: 'Bearer token required in Authorization header',
  })
})

const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {}

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

  console.log('Has token')

  const sessionId = req.headers['mcp-session-id'] as string | undefined
  let transport: StreamableHTTPServerTransport

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId]
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        transports[sessionId] = transport
      },
    })

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId]
      }
    }

    const server = createMCPServer(token)

    // Connect to the MCP server
    await server.connect(transport)
  } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    })
    return
  }

  console.log('Handling request')

  // Handle the request
  await transport.handleRequest(req, res, req.body)
})

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req: express.Request, res: express.Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined
  console.log('Handling session request from GET or DELETE')

  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID')
    return
  }

  console.log('Session ID:', sessionId)

  const transport = transports[sessionId]
  await transport.handleRequest(req, res)
}

// Handle GET requests for server-to-client notifications via SSE
app.get('/mcp', handleSessionRequest)

// Handle DELETE requests for session termination
app.delete('/mcp', handleSessionRequest)

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
