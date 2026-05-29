export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized: No cookies found' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const insforgeUrl = process.env.VITE_INSFORGE_URL || process.env.INSFORGE_URL;
  const insforgeAnonKey = process.env.VITE_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY;

  if (!insforgeUrl) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration: VITE_INSFORGE_URL is missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    // 1. Verify Authentication by pinging the InsForge backend
    const authRes = await fetch(`${insforgeUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
        'apikey': insforgeAnonKey || '',
        'Origin': 'https://draftdesk-steel.vercel.app',
        'Referer': 'https://draftdesk-steel.vercel.app/'
      },
      body: JSON.stringify({})
    });

    const authData = await authRes.json();
    const user = authData?.data?.user || authData?.user;

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid session' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Extract payload
    const { topic, niche, style_notes, platform } = await req.json();

    // 3. Check rate limits
    const profileRes = await fetch(`${insforgeUrl}/rest/v1/profiles?id=eq.${user.id}&select=ai_generations_count`, {
      headers: {
        'Cookie': cookieHeader,
        'apikey': insforgeAnonKey || '',
      }
    });
    
    if (profileRes.ok) {
      const profiles = await profileRes.json();
      if (profiles && profiles.length > 0) {
        const count = profiles[0].ai_generations_count || 0;
        if (count >= 50) {
          return new Response(JSON.stringify({ error: 'Rate limit exceeded: Max 50 generations per month' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
        }
      }
    }

    // 4. Call Groq API
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: GROQ_API_KEY is missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const systemPrompt = `You are a content strategist and scriptwriter for solo creators.
Generate a video script based on the topic provided.

The creator's niche is: ${niche || 'General'}
Their style notes: ${style_notes || 'None'}
Target platform: ${platform || 'YouTube'}

Respond in this exact JSON format:
{
  "hook": "Opening hook (first 15 seconds). Must grab attention immediately. Start with a bold statement, question, or surprising fact.",
  "body": "Main content body (1-3 minutes). Break down the topic clearly. Use conversational tone. Include specific examples and actionable tips.",
  "cta": "Call to action (last 15 seconds). Tell the viewer exactly what to do next.",
  "broll_notes": "Comma-separated list of 4-5 B-roll shot suggestions that would enhance this video.",
  "seo_title": "SEO-optimized video title (under 60 chars)",
  "seo_description": "SEO video description (under 160 chars)",
  "seo_tags": "Comma-separated relevant tags"
}

Make the script natural and conversational, not robotic.
If the creator is introverted or camera-shy (check style_notes), suggest more
voiceover + screen recording style rather than face-to-camera.`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // Using high-capability Groq model instead of Claude
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Topic: ${topic}` }
        ]
      })
    });

    if (!groqRes.ok) {
      const errTxt = await groqRes.text();
      console.error('Groq Error:', errTxt);
      return new Response(JSON.stringify({ error: 'Failed to generate script' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const groqData = await groqRes.json();
    const content = groqData.choices[0]?.message?.content;
    
    if (!content) {
      return new Response(JSON.stringify({ error: 'AI returned empty response' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // 5. Increment generation count
    // Use an RPC if we had one, or simply read the value and update it.
    // For MVP without RPC, we read it before, so we can just update it.
    const currentCount = await profileRes.clone().json().then(p => p[0]?.ai_generations_count || 0).catch(() => 0);
    await fetch(`${insforgeUrl}/rest/v1/profiles?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: {
        'Cookie': cookieHeader,
        'apikey': insforgeAnonKey || '',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        ai_generations_count: currentCount + 1
      })
    });

    // 6. Return response
    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
