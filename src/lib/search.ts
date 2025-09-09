import type { CardSearchResult } from '../types/search'
import type { BoardSearchResult } from '../types/boards'
import { apiClient } from './api-client'

export type SearchObjectType = 'boards' | 'cards' | 'pages' | 'projects'
export type SearchField = 'title' | 'content'
export type CardStatus = 'backlog' | 'committed' | 'started' | 'completed' | 'cancelled'

export interface SearchOptions {
  query: string
  cursor?: string
  count?: number
  types?: SearchObjectType[]
  fields?: SearchField[]
  archived?: boolean
  statuses?: CardStatus[]
  project_id?: string
  grouped?: boolean
}

export interface SearchResult {
  cursor?: string
  count: number
  boards?: BoardSearchResult[]
  cards?: CardSearchResult[]
  pages?: any[]
  projects?: any[]
  epics?: any[]
  notes?: any[]
}

export async function search(
  teamId: string,
  token: string,
  options: SearchOptions
): Promise<SearchResult> {
  const params = new URLSearchParams()

  params.append('query', options.query)

  if (options.cursor) params.append('cursor', options.cursor)
  if (options.count) params.append('count', options.count.toString())
  if (options.types) params.append('types', options.types.join(','))
  if (options.fields) params.append('fields', options.fields.join(','))
  if (options.archived !== undefined) params.append('archived', options.archived.toString())
  if (options.statuses) params.append('statuses', options.statuses.join(','))
  if (options.project_id) params.append('project_id', options.project_id)
  if (options.grouped !== undefined) params.append('grouped', options.grouped.toString())

  const endpoint = `/${teamId}/search?${params.toString()}`

  return await apiClient.makeRequest(endpoint, token)
}
