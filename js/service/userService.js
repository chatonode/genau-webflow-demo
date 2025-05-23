import protectedFetch from '../api/protectedApi.js'

/**
 * Fetch current user; returns { user, status, error }
 */
export async function getUserProfile() {
  try {
    const response = await protectedFetch.get('/api/v1/user/me')
    if (response.ok) {
      const responseBody = await response.json()
      return { user: responseBody.data, status: response.status, error: null }
    }
    return { user: null, status: response.status, error: null }
  } catch (error) {
    console.error('User profile request failed:', error)
    return { user: null, status: null, error }
  }
}
