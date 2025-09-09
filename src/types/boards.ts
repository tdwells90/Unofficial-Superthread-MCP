import type { Card } from './cards'
import type { Archived, CardMember, Tag } from './common'

export type BoardList = {
  id: string
  title: string
  cards: Card[]
  total_cards: number
}

export type BoardSearchResult = {
  id: string
  title: string
  project_id: string
  archived?: Archived
  layout: string
}

export type Board = {
  id: string
  project_id: string
  team_id: string
  title: string
  content: string
  icon: string
  color: string
  user_id: string
  time_created: number
  time_updated: number
  members: CardMember[]
  lists: BoardList[]
  list_order: Record<string, any>
  tags: Tag[]
  is_watching: boolean
  is_bookmarked: boolean
}

export type BoardResponse = {
  board: Board
}
