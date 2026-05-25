const https = require('https');

https.get('https://nextgened.netlify.app/', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const jsMatch = d.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (jsMatch) {
      https.get('https://nextgened.netlify.app' + jsMatch[1], (res2) => {
        let d2 = '';
        res2.on('data', c => d2 += c);
        res2.on('end', () => {
          const mp4Match = d2.match(/"([^"]+\.mp4)"/);
          if (mp4Match) {
            console.log('https://nextgened.netlify.app' + mp4Match[1]);
          } else {
            console.log('no mp4 found');
          }
        });
      });
    }
  });
});
