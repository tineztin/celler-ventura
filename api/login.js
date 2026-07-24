import crypto from 'crypto';

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.APP_PASSWORD || !process.env.AUTH_SECRET) {
    return res.status(500).json({ error: 'Falta configurar APP_PASSWORD o AUTH_SECRET a Vercel' });
  }

  const { password } = req.body;
  if (password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Contrasenya incorrecta' });
  }

  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = String(expiry);
  const sig = sign(payload, process.env.AUTH_SECRET);
  const token = `${payload}.${sig}`;

  res.setHeader('Set-Cookie', `celler_auth=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/`);  return res.status(200).json({ ok: true });
}
