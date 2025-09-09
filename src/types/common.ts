export type Archived = {
  user_id: string
  time_archived: number
}

export type Icon = {
  type: string
  src: string
  blurhash: string
  color: string
  emoji: string
}

export type UserSource = {
  type: string
  client_id: string
  import_id: string
  agent_id: string
  email_addr: string
  email_verified: boolean
}

export type UserInfo = {
  user_id: string
  type: string
  source: UserSource
}

export type Collaboration = {
  token: string
}

export type ExternalLink = {
  type: string
  github_pull_request?: {
    id: number
    number: number
    state: string
    title: string
    body: string
    html_url: string
    time_created: number
    time_updated: number
    time_closed: number
    time_merged: number
    head: {
      label: string
      ref: string
    }
    base: {
      label: string
      ref: string
    }
    draft: boolean
    merged: boolean
  }
}

export type Tag = {
  id: string
  team_id: string
  project_id: string
  name: string
  slug: string
  color: string
  total_cards: number
}

export type Hint = {
  type: string
  tag?: {
    name: string
  }
  relation?: {
    card: {
      title: string
      card_id: string
      user_id: string
      project_id: string
      board_id: string
      board_title: string
      list_id: string
      list_title: string
      list_color: string
      status: string
    }
    similarity: number
  }
}

export type ChecklistItem = {
  id: string
  title: string
  content: string
  checklist_id: string
  user_id: string
  time_created: number
  time_updated: number
  checked: boolean
}

export type Checklist = {
  id: string
  title: string
  content: string
  card_id: string
  user_id: string
  time_created: number
  time_updated: number
  items: ChecklistItem[]
}

export type CardMember = {
  user_id: string
  assigned_date: number
  role: string
}

export type ChildCard = {
  title: string
  card_id: string
  user_id: string
  project_id: string
  board_id: string
  board_title: string
  list_id: string
  list_title: string
  list_color: string
  status: string
  archived?: Archived
}

export type LinkedCard = {
  title: string
  card_id: string
  user_id: string
  project_id: string
  board_id: string
  board_title: string
  list_id: string
  list_title: string
  status: string
  archived?: Archived
  linked_card_type: string
}