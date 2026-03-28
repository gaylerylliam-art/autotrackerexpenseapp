/**
 * AutoTrack — Global Configuration Layer
 * Centralized environment and operation settings.
 */

const isProd = import.meta.env.PROD
const isDev = import.meta.env.DEV

export const CONFIG = {
  APP_NAME: 'AutoTrack',
  VERSION: '2.4.0',
  API_URL: import.meta.env.VITE_API_URL || 'https://api.autotrack.fleet/v1',
  IS_PRODUCTION: isProd,
  IS_DEVELOPMENT: isDev,
  AUTH_STUB_TOKEN: 'autotrack_dev_session_token',
  VAT_RATE: 0.05,
  DUBAI_COORDINATES: { lat: 25.2048, long: 55.2708 },
  
  // Storage keys to avoid typos
  STORAGE: {
    TOKEN: 'autotrack_token',
    SETUP_COMPLETE: 'autotrack_setup_complete',
    THEME: 'autotrack_theme_pref'
  }
}

export default CONFIG
