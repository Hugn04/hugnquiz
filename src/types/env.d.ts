interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_API: string;
    readonly VITE_APP_DOMAIN: string;
    readonly VITE_APP_CHAT_API: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
