const BASE_URL = 'https://api.superthread.com/v1'

export class SuperthreadAPIClient {
  async makeRequest(endpoint: string, token: string, options: RequestInit = {}): Promise<any> {
    if (!token) {
      throw new Error(
        'Authorization token is required. Please provide a valid Superthread Personal Access Token.'
      )
    }

    const url = `${BASE_URL}${endpoint}`
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`
      )
    }

    if (response.status === 204) {
      return null
    }

    return await response.json()
  }
}

export const apiClient = new SuperthreadAPIClient()
