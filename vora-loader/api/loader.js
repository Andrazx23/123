import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isBrowser = ua.includes('mozilla') || ua.includes('chrome') || ua.includes('safari');

  if (isBrowser) {
    return res.status(200).setHeader('Content-Type', 'text/html').send(`
      <!DOCTYPE html><html><head><title>Protected</title></head>
      <body style="background:#000;color:#f00;text-align:center;padding:100px;font-family:monospace;">
        <h1>SCRIPT IS PROTECTED</h1><p>Gak bisa liat langsung bro</p>
      </body></html>
    `);
  }

  const script = fs.readFileSync(path.join(process.cwd(), 'public', 'script.lua'), 'utf8');
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(script);
}
