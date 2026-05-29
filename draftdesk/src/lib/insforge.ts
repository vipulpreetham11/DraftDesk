import { createClient } from '@insforge/sdk';

const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!insforgeAnonKey) {
  console.warn('InsForge credentials are missing. Please add VITE_INSFORGE_ANON_KEY to your .env.local file.');
}

// We exclusively use a relative URL so that the Vite proxy (in dev) and Vercel proxy (in prod)
// handle all /api requests. This completely eliminates third-party cookie blocking issues.
export const insforge = createClient({
  baseUrl: typeof window !== 'undefined' ? window.location.origin : '', 
  anonKey: insforgeAnonKey || 'placeholder-key'
});
