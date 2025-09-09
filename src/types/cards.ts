import type { Epic } from './projects'
import type { 
  Icon, 
  UserInfo, 
  Collaboration, 
  Tag, 
  Checklist, 
  CardMember, 
  ChildCard, 
  LinkedCard,
  Archived 
} from './common'

export type { CardMember } from './common'

export type ParentCard = {
  title: string
  card_id: string
  list_color: string
  status: string
}

export type Card = {
  id: string
  type: string
  icon: Icon
  team_id: string
  title: string
  content: string
  schema: number
  collaboration: Collaboration
  status: string
  priority: number
  board_id: string
  board_title: string
  list_id: string
  list_color: string
  list_title: string
  sprint_id: string
  owner_id: string
  user_id: string
  user_id_updated: string
  user: UserInfo
  user_updated: UserInfo
  start_date: number
  due_date: number
  completed_date: number
  time_created: number
  time_updated: number
  members: CardMember[]
  checklists: Checklist[]
  checklist_order: Record<string, any>
  checklist_item_order: Record<string, any>
  parent_card?: ParentCard
  child_cards: ChildCard[]
  child_card_order: Record<string, any>
  linked_cards: LinkedCard[]
  archived?: Archived
  archived_list?: boolean
  archived_board?: boolean
  tags: Tag[]
  total_comments: number
  total_files: number
  is_watching: boolean
  is_bookmarked: boolean
  project_id: string
  external_links: Record<string, any>[]
  hints: Record<string, any>[]
  estimate: number
  epic: Epic
}
