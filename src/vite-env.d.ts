/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_NODE_ENV: string
  readonly VITE_ENABLE_WEBCAM: string
  readonly VITE_ENABLE_AUDIO_ANALYSIS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}