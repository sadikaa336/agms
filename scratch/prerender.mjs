import fs from 'node:fs';
import path from 'node:path';

// Import nitro server listener
await import('../frontend/.output/server/index.mjs');

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/login');
    const text = await res.text();
    const dest1 = path.resolve('frontend/.output/public/index.html');
    const dest2 = path.resolve('cpanel_upload/index.html');
    fs.writeFileSync(dest1, text, 'utf8');
    fs.writeFileSync(dest2, text, 'utf8');
    console.log('Successfully prerendered login page into index.html! Length:', text.length);
    process.exit(0);
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(1);
  }
}, 1200);
