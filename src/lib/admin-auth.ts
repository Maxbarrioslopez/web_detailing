import { isDemoModeEnabled } from '@/lib/runtime-config'

export type AdminAccessState = {
  demoMode: boolean
  authenticated: boolean
  canAccess: boolean
}

const isAuthenticatedAdmin = async () => {
  /**
   * TODO:
   * Replace this stub with the future auth provider/session check.
   * Suggested integration points:
   * - NextAuth/Auth.js session
   * - Supabase auth cookie/session
   * - custom signed admin cookie + middleware
   */
  return false
}

export const getAdminAccessState = async (): Promise<AdminAccessState> => {
  const demoMode = isDemoModeEnabled()

  if (demoMode) {
    return {
      demoMode,
      authenticated: true,
      canAccess: true,
    }
  }

  const authenticated = await isAuthenticatedAdmin()

  return {
    demoMode,
    authenticated,
    canAccess: authenticated,
  }
}
