import crypto from 'crypto';

function parseCookie(req, name) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map(s => s.trim()).find(s => s.startsWith(name + '='));
  return match ? match.split('=')[1] : null;
}

function verify(token, secret) {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (sig !== expected) return false;
  if (Number(payload) < Date.now()) return false;
  return true;
}

export default async function handler(req, res) {
  const token = parseCookie(req, 'celler_auth');
  const ok = verify(token, process.env.AUTH_SECRET);
  return res.status(200).json({ authenticated: ok });
}
