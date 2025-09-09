import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { search } from '../lib/search.js'
import { apiClient } from '../lib/api-client.js'
import { getUserFromToken, getUserTeams } from './user.js'
import type { ProjectFromSearch } from '../types/projects'

export const listProjectsSchema = {
  team_id: z
    .string()
    .describe(
      'Use the get_me tool first to get the team IDs available. If needed, confirm with the user which team they want to use.'
    ),
}

export async function listProjects(args: any, token: string) {
  const { team_id } = args as z.infer<z.ZodObject<typeof listProjectsSchema>>

  const projects = await apiClient.makeRequest(`/${team_id}/epics`, token)

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(projects, null, 2),
      },
    ],
  }
}

export const getProjectSchema = {
  query: z.string().describe('Search query for the project name or description'),
  exact_match: z
    .boolean()
    .optional()
    .describe('Whether to return only exact matches (default: false)'),
}

export async function getProject(args: any, token: string) {
  const user = await getUserFromToken(token)
  const teamIds = await getUserTeams(user)

  const allProjects: ProjectFromSearch[] = []
  const seenIds = new Set<string>()

  for (const teamId of teamIds) {
    try {
      const searchResults = await search(teamId, token, {
        query: args.query,
      })

      if (searchResults?.epics) {
        for (const project of searchResults.epics) {
          if (!seenIds.has(project.id)) {
            seenIds.add(project.id)

            if (args.exact_match) {
              if (project.title?.toLowerCase() === args.query.toLowerCase()) {
                allProjects.push(project)
              }
            } else {
              allProjects.push(project)
            }
          }
        }
      }
    } catch (error) {
      continue
    }
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            query: args.query,
            found_projects: allProjects.length,
            projects: allProjects,
          },
          null,
          2
        ),
      },
    ],
  }
}

export function registerProjectTools(server: McpServer, authToken: string) {
  server.registerTool(
    'list_projects',
    {
      title: 'List all projects (epics) in a team',
      description: 'Fetches a list of all projects (epics) in a team',
      inputSchema: listProjectsSchema,
    },
    (args) => listProjects(args, authToken)
  )

  server.registerTool(
    'get_project',
    {
      title: 'Retrieve all details about a project (epic)',
      description: 'Fetches detailed information about a specific project',
      inputSchema: getProjectSchema,
    },
    (args) => getProject(args, authToken)
  )
}
