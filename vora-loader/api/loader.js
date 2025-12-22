// api/loader.js - Fixed untuk Vercel 2025
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,  // Biar gak parse body otomatis
    externalResolver: true,  // Fix buat dynamic imports kalau perlu
  },
};

export default function handler(req, res) {
  try {
    // DETEKSI BROWSER vs EXECUTOR
    const userAgent = req.headers['user-agent'] || '';
    const accept = req.headers['accept'] || '';
    const isBrowser = 
      userAgent.includes('Mozilla') || 
      userAgent.includes('Chrome') || 
      userAgent.includes('Safari') ||
      accept.includes('text/html');

    if (isBrowser) {
      // HTML palsu anti-crack
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Access Denied</title></head>
        <body style="background:#000;color:#f00;font-family:monospace;text-align:center;padding:100px;">
          <h1>404 - SCRIPT PROTECTED</h1>
          <p>Ini bukan buat kamu. Join Discord: discord.gg/yourserver</p>
          <script>document.body.innerHTML += '<p>Detected browser access!</p>'; alert("No peeking!");</script>
        </body>
        </html>
      `);
      return;
    }

    // EXECUTOR MODE: Kasih script Lua asli
    const luaPath = path.join(process.cwd(), 'public', 'real-loader.lua');
    let realScript;
    try {
      realScript = fs.readFileSync(luaPath, 'utf8');
    } catch (err) {
      console.error('File read error:', err);  // Log buat debug
      res.status(500).send('Internal error: File not found');
      return;
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');  // Biar Roblox HttpGet jalan
    res.status(200).send(realScript);
  } catch (error) {
    console.error('Handler error:', error);  // Vercel log ini
    res.status(500).json({ error: 'Server error' });
  }
}
