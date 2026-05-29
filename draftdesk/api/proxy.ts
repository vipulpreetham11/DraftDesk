export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const targetPath = url.searchParams.get('path');
    
    if (!targetPath) {
      return new Response('Missing path', { status: 400 });
    }

    const insforgeUrl = process.env.VITE_INSFORGE_URL || process.env.INSFORGE_URL;
    if (!insforgeUrl) {
      return new Response('Missing INSFORGE_URL', { status: 500 });
    }

    // Forward the query string as well
    url.searchParams.delete('path');
    const queryString = url.searchParams.toString();
    const targetUrl = `${insforgeUrl}/api/${targetPath}${queryString ? `?${queryString}` : ''}`;

    // Clone headers
    const headers = new Headers(req.headers);
    // Remove host to avoid conflicts
    headers.delete('host');

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.blob() : undefined,
      redirect: 'manual'
    });

    const proxyHeaders = new Headers(response.headers);
    
    // Strip Domain from Set-Cookie to allow localhost and Vercel to store the cookie
    const setCookieHeaders = proxyHeaders.get('set-cookie');
    if (setCookieHeaders) {
      // Fetch API combines multiple set-cookie headers into one string separated by commas.
      // But standard parsing is hard. In Edge runtime, response.headers.getSetCookie() might be available.
      if (typeof proxyHeaders.getSetCookie === 'function') {
        const cookies = proxyHeaders.getSetCookie();
        proxyHeaders.delete('set-cookie');
        cookies.forEach(cookie => {
          // Remove Domain=...
          const modifiedCookie = cookie.replace(/Domain=[^;]+;?\s*/i, '');
          proxyHeaders.append('set-cookie', modifiedCookie);
        });
      } else {
        // Fallback for older environments
        const modifiedCookie = setCookieHeaders.replace(/Domain=[^;]+;?\s*/gi, '');
        proxyHeaders.set('set-cookie', modifiedCookie);
      }
    }

    // Important: fix CORS headers to allow our origin
    const origin = req.headers.get('origin');
    if (origin) {
      proxyHeaders.set('access-control-allow-origin', origin);
      proxyHeaders.set('access-control-allow-credentials', 'true');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: proxyHeaders
    });
  } catch (err: any) {
    console.error('Proxy error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
