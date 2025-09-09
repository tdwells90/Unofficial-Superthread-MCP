import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { apiClient } from '../lib/api-client.js'
import type { User } from '../types/user.js'

export const getMeSchema = {}

export const updateMeSchema = {
  first_name: z.string().optional().describe('First name'),
  last_name: z.string().optional().describe('Last name'),
  display_name: z.string().optional().describe('Display name'),
  profile_image: z.string().optional().describe('Profile image URL'),
  timezone_id: z.string().optional().describe('Timezone ID'),
  locale: z.string().optional().describe('Locale'),
}

export const getUserFromToken = async (token: string): Promise<User> => {
  return await apiClient.makeRequest('/users/me', token)
}

export async function getMe(token: string) {
  const user = await getUserFromToken(token)

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(user, null, 2),
      },
    ],
  }
}

export function registerUserTools(server: McpServer, authToken: string) {
  server.registerTool(
    'get_me',
    {
      title: 'Fetch the current user Information',
      description:
        'Fetches detailed information about the current user, including profile details, teams, locale, and other metadata',
      inputSchema: {},
    },
    () => getMe(authToken)
  )

  server.registerTool(
    'update_me',
    {
      title: 'Update User Information',
      description:
        'Updates the current user profile fields such as name, profile image, timezone, and company information',
      inputSchema: updateMeSchema,
    },
    (args) => updateMe(args, authToken)
  )
}

export async function getUserTeams(user: User): Promise<string[]> {
  return user?.user?.teams?.map((team: any) => team.id) || []
}

export async function updateMe(args: any, token: string) {
  const typedArgs = args as z.infer<z.ZodObject<typeof updateMeSchema>>
  const allowedFields = [
    'first_name',
    'last_name',
    'display_name',
    'profile_image',
    'timezone_id',
    'locale',
  ]

  const updateData: Record<string, any> = {}
  for (const [key, value] of Object.entries(typedArgs)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updateData[key] = value
    }
  }

  const user = await apiClient.makeRequest('/users/me', token, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  })

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(user, null, 2),
      },
    ],
  }
}
