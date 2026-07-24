import crypto from 'crypto';

function isAuthed(req) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map(s => s.trim()).find(s => s.startsWith('celler_auth='));
  const token = match ? match.split('=')[1] : null;
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', process.env.AUTH_SECRET).update(payload).digest('hex');
  return sig === expected && Number(payload) >= Date.now();
}

export default async function handler(req, res) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'No autoritzat' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.VITE_ANTHROPIC_API_KEY) return res.status(500).json({ error: 'FALTA VITE_ANTHROPIC_API_KEY' });

  try {
    const { image, mediaType } = req.body;
    if (!image) return res.status(400).json({ error: 'No se recibió ninguna imagen' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            { type: 'text', text: 'Read this wine bottle label. Reply ONLY with JSON: {"name":"wine name","vintage":2019,"winery":"producer name","region":"appellation","type":"tinto|blanco|rosado|cava|champagne|sauternes"} or {"error":"cannot read"}' }
          ]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok || data.type === 'error') {
      return res.status(response.status).json({ error: `Anthropic API error: ${data.error?.message || JSON.stringify(data)}` });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
