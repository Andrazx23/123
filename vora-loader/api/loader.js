// api/loader.lua (Vercel Serverless Function)
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req, res) {
  // DETEKSI: Kalau dibuka dari browser → kasih HTML palsu
  const userAgent = req.headers['user-agent'] || ''
  const referer = req.headers['referer'] || ''
  const accept = req.headers['accept'] || ''

  const isBrowser = 
    userAgent.includes('Mozilla') || 
    userAgent.includes('Chrome') || 
    userAgent.includes('Safari') ||
    accept.includes('text/html') ||
    referer.includes('http')

  if (isBrowser) {
    // Tampilkan HTML palsu (bikin orang bingung)
    res.setHeader('Content-Type', 'text/html')
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>404 Not Found</title></head>
      <body style="background:#000;color:#0f0;font-family:courier;text-align:center;padding:100px;">
        <h1>SCRIPT NOT FOUND</h1>
        <p>Kamu gak bisa lihat script di sini bro</p>
        <p>Join discord kami: discord.gg/xxxxxx</p>
        <script>alert("Script udah di-protect!")</script>
      </body>
      </html>
    `)
  }

  // Kalau dari executor (HttpGet Roblox) → kasih script asli
  const realScript = fs.readFileSync(
    path.join(process.cwd(), 'public', 'real-loader.lua'),
    'utf8'
  )

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'no-store')
  res.send(realScript)
}
