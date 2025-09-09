export type User = {
  user: {
    id: string
    email: string
    email_confirmed: boolean
    first_name: string
    last_name: string
    display_name: string
    profile_image: string
    thumbnail_image: string
    color: string
    status: string
    teams: Team[]
    time_created: number
    time_updated: number
    current_project: string
    timezone_id: string
    autodetect_timezone_id: boolean
    locale: string
    transcription_keywords: string[]
    job_description: string
  }
  token_outdated: boolean
  token_privileged: boolean
}

export type Team = {
  archived?: {
    user_id: string
    time_archived: number
  }
  id: string
  sub_domain: string
  team_name: string
  company_name: string
  email_domain: string
  creator_user_id: string
  time_created: number
  time_updated: number
  trashed?: {
    user_deleted: {
      user_id: string
      type: string
      source: {
        type: string
        client_id: string
        import_id: string
        agent_id: string
        email_addr: string
        email_verified: boolean
      }
    }
    time_deleted: number
  }
  logo: {
    type: string
    src: string
    blurhash: string
    color: string
    emoji: string
  }
  subscription_plan_id: string
  features: Feature[]
  limits: Limit[]
  team_description: string
  role: string
  status: string
  flags: string[]
}

export type Feature = {
  id: string
  enabled: boolean
  time_enabled: number
  toggleable: boolean
}

export type Limit = {
  id: string
  limit_value: string
}
