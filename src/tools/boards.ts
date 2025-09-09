import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { apiClient } from '../lib/api-client.js'
import { search } from '../lib/search'
import { getUserFromToken, getUserTeams } from './user'
import type { Board, BoardSearchResult } from '../types/boards'

export const createBoardSchema = {
  team_id: z
    .string()
    .describe(
      'Use the get_me tool first to get the team IDs available. If needed, confirm with the user which team they want to use.'
    ),
  title: z.string().describe('Board title'),
  project_id: z.string().optional().describe('Project ID to associate the board with'),
  content: z.string().optional().describe('Board description/content'),
  icon: z.string().optional().describe('Board icon'),
  color: z.string().optional().describe('Board color'),
  layout: z.string().optional().describe('Board layout (defaults to "board")'),
  lists: z
    .array(
      z.object({
        title: z.string().describe('List title'),
        content: z.string().optional().describe('List description'),
        icon: z.string().optional().describe('List icon'),
        behavior: z.string().optional().describe('List behavior (e.g., "backlog")'),
      })
    )
    .optional()
    .describe('Initial lists to create for the board'),
  members: z
    .array(
      z.object({
        user_id: z.string().describe('User ID'),
        role: z.string().describe('User role (e.g., "admin")'),
      })
    )
    .optional()
    .describe('Initial members to add to the board'),
}

export async function createBoard(args: any, token: string) {
  const typedArgs = args as z.infer<z.ZodObject<typeof createBoardSchema>>
  const { team_id, ...boardData } = typedArgs

  const payload = {
    layout: 'board',
    ...boardData,
  }

  const board = await apiClient.makeRequest(`/${team_id}/boards`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(board, null, 2),
      },
    ],
  }
}

export const updateBoardSchema = {
  team_id: z
    .string()
    .describe(
      'Use the get_me tool first to get the team IDs available. If needed, confirm with the user which team they want to use.'
    ),
  board_id: z.string().describe('Use the get_board tool to retrieve the board ID'),
  project_id: z.string().optional().describe('Project ID to associate the board with'),
  title: z.string().optional().describe('Board title'),
  content: z.string().optional().describe('Board description/content'),
  icon: z.string().optional().describe('Board icon'),
  color: z.string().optional().describe('Board color'),
  image_urls: z.array(z.string()).optional().describe('Array of image URLs'),
  thumbnail_url: z.string().optional().describe('Thumbnail image URL'),
  archived: z.boolean().optional().describe('Archive/unarchive the board'),
  position: z.number().optional().describe('Position/ordering of the board'),
  vcs_mapping: z.record(z.any()).optional().describe('Version control system mappings'),
  layout: z.string().optional().describe('Board layout'),
}

export async function updateBoard(args: any, token: string) {
  const typedArgs = args as z.infer<z.ZodObject<typeof updateBoardSchema>>
  const { team_id, board_id, ...updateData } = typedArgs

  const board = await apiClient.makeRequest(`/${team_id}/boards/${board_id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  })

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(board, null, 2),
      },
    ],
  }
}

export const listBoardsSchema = {
  team_id: z.string().describe('Use the getMe tool to get the team ID'),
  project_id: z.string().describe('Project ID'),
  bookmarked: z.boolean().optional().describe('Filter for bookmarked boards'),
  archived: z.boolean().optional().describe('Filter for archived boards'),
}

export async function listBoards(args: any, token: string) {
  const { team_id, project_id, bookmarked, archived } = args as z.infer<
    z.ZodObject<typeof listBoardsSchema>
  >
  const params = new URLSearchParams({
    project_id,
    ...(bookmarked !== undefined && { bookmarked: String(bookmarked) }),
    ...(archived !== undefined && { archived: String(archived) }),
  })

  const boards = await apiClient.makeRequest(`/${team_id}/boards?${params}`, token)

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(boards, null, 2),
      },
    ],
  }
}

export const getBoardSchema = {
  query: z.string().describe('Board title or identifier to search for'),
}

/**
 * Fetches detailed information about a specific board by its title or ID (minus the prefix)
 */
export async function getBoard(args: any, token: string) {
  const { query } = args as z.infer<z.ZodObject<typeof getBoardSchema>>

  const user = await getUserFromToken(token)
  const teamIds = await getUserTeams(user)

  // The list of boards returned. Ideally, this should be one board. But
  // the search may return multiple boards if the user has access to multiple teams.
  const allBoards: Board[] = []

  // Declare a tuple of board search result and team ID
  const seenBoards: [BoardSearchResult, string][] = []

  for (const teamId of teamIds) {
    try {
      const searchResults = await search(teamId, token, {
        query,
        types: ['boards'],
      })

      if (searchResults.boards) {
        for (const board of searchResults.boards) {
          if (!seenBoards.find((b) => b[0].id === board.id)) {
            seenBoards.push([board, teamId])
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching board IDs for team ${teamId}:`, error)
      throw new Error(`Error fetching board IDs for team ${teamId}: ${error}`)
    }
  }

  if (!seenBoards.length) {
    throw new Error('No boards found')
  }

  for (const [seenBoard, teamId] of seenBoards) {
    const board = await apiClient.makeRequest(`/${teamId}/boards/${seenBoard.id}`, token)
    allBoards.push(board.board)
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(allBoards, null, 2),
      },
    ],
  }
}

export const deleteBoardSchema = {
  team_id: z
    .string()
    .describe(
      'Use the get_me tool first to get the team IDs available. If needed, confirm with the user which team they want to use.'
    ),
  board_id: z.string().describe('Use the get_board tool to retrieve the board ID'),
}

export async function deleteBoard(args: any, token: string) {
  const { team_id, board_id } = args as z.infer<z.ZodObject<typeof deleteBoardSchema>>
  await apiClient.makeRequest(`/${team_id}/boards/${board_id}`, token, {
    method: 'DELETE',
  })

  return {
    content: [
      {
        type: 'text' as const,
        text: 'Board deleted successfully',
      },
    ],
  }
}

export function registerBoardTools(server: McpServer, authToken: string) {
  server.registerTool(
    'create_board',
    {
      title: 'Create a new board',
      description: 'Creates a new board within a specified workspace (team_id)',
      inputSchema: createBoardSchema,
    },
    (args) => createBoard(args, authToken)
  )

  server.registerTool(
    'update_board',
    {
      title: 'Update an existing board',
      description: 'Updates an existing board within a specified workspace (team_id)',
      inputSchema: updateBoardSchema,
    },
    (args) => updateBoard(args, authToken)
  )

  server.registerTool(
    'list_boards',
    {
      title: 'Fetches a list of all boards within a specified workspace (team_id)',
      description: 'Fetches a list of all boards within a specified workspace (team_id)',
      inputSchema: listBoardsSchema,
    },
    (args) => listBoards(args, authToken)
  )

  server.registerTool(
    'get_board',
    {
      title: 'Retrieve all details about a specific board',
      description:
        'Fetches detailed information about a specific board identified by its unique ID within a workspace (team_id)',
      inputSchema: getBoardSchema,
    },
    (args) => getBoard(args, authToken)
  )

  server.registerTool(
    'delete_board',
    {
      title: 'Delete a board',
      description:
        'Deletes a specific board, identified by its board_id, within the specified workspace (team_id)',
      inputSchema: deleteBoardSchema,
    },
    (args) => deleteBoard(args, authToken)
  )
}
