export default async function handler(req, res) {
  const URL = process.env.UPSTASH_REDIS_REST_URL;
  const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!URL || !TOKEN) {
    return res.status(500).json({ error: 'Falta configurar Upstash en Vercel Environment Variables' });
  }

  const { key } = req.query;
  if (!['wines', 'history'].includes(key)) {
    return res.status(400).json({ error: 'Paràmetre key invàlid' });
  }
  const redisKey = `celler_${key}`;

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${URL}/get/${redisKey}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const d = await r.json();
      return res.status(200).json({ value: d.result ? JSON.parse(d.result) : null });
    }

    if (req.method === 'POST') {
      const value = JSON.stringify(req.body);
      const r = await fetch(`${URL}/set/${redisKey}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'text/plain' },
        body: value
      });
      const d = await r.json();
      return res.status(200).json({ ok: d.result === 'OK' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
