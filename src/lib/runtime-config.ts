export type DataProvider = 'demo' | 'supabase'

const getEnv = (key: string) => process.env[key]?.trim() || ''

export const isDemoModeEnabled = () => getEnv('DEMO_MODE').toLowerCase() === 'true'

export const getDataProvider = (): DataProvider =>
  getEnv('DATA_PROVIDER').toLowerCase() === 'supabase' ? 'supabase' : 'demo'

export const getSupabaseConfig = () => ({
  url: getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
  storageBucket: getEnv('SUPABASE_STORAGE_BUCKET') || 'garage-zona-cero',
})

export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig()

  return Boolean(config.url && config.anonKey && config.serviceRoleKey)
}

export const getRuntimeFeatureState = () => ({
  demoMode: isDemoModeEnabled(),
  dataProvider: getDataProvider(),
  supabaseReady: isSupabaseConfigured(),
  storageBucket: getSupabaseConfig().storageBucket,
})
