import type { 
  Icon, 
  UserInfo, 
  Collaboration, 
  ExternalLink, 
  Tag, 
  Hint, 
  Checklist, 
  CardMember, 
  ChildCard, 
  LinkedCard,
  Archived 
} from './common'

export type ProjectIcon = Icon

export type ProjectFromSearch = {
  id: string
  icon: ProjectIcon
  title: string
  total_members: number
  user_id: string
  time_created: number
  is_private: boolean
}

export type Project = {
  epic: {
    id: string
    type: string
    team_id: string
    icon: Icon
    title: string
    schema: number
    content: string
    collaboration: Collaboration
    list_id: string
    list_color: string
    list_title: string
    status: string
    priority: number
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
    child_cards: ChildCard[]
    child_card_order: Record<string, any>
    linked_cards: LinkedCard[]
    archived?: Archived
    archived_list: boolean
    tags: Tag[]
    total_comments: number
    total_files: number
    is_watching: boolean
    external_links: ExternalLink[]
    hints: Hint[]
  }
}

export type Epic = {
  id: string
  title: string
  icon: Icon
}
