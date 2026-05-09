/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_APPS_SCRIPT_URL: string
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_SHEET_ID: string
  readonly VITE_GOOGLE_API_KEY: string
  readonly VITE_META_PIXEL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
