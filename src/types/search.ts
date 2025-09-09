import type { CardMember, ParentCard } from './cards'
import type { Archived } from './common'
import type { Epic } from './projects'

export type CardSearchResult = {
  id: string
  title: string
  project_id: string
  board_id: string
  sprint_id: string
  board_title: string
  list_id: string
  list_title: string
  list_color: string
  status: string
  owner_id: string
  members: CardMember[]
  archived?: Archived
  epic: Epic
  parent_card: ParentCard
}
