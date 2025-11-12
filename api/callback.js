// api/callback.js
// Bu işlemde "axios" kütüphanesi gereklidir. Vercel, bağımlılıkları otomatik olarak yönetir.

const axios = require('axios');
const querystring = require('querystring');

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} = process.env;

module.exports = async (req, res) => {
  const code = req.query.code || null;

  if (code) {
    try {
      // Access Token'ı almak için Spotify'a POST isteği yap
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization':
            'Basic ' +
            Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
        },
      });

      const { access_token } = response.data;
      
      // Access Token'ı güvenli bir şekilde ana sayfaya yönlendirerek gönder
      // Bu URL, index.html'deki JavaScript tarafından okunacaktır.
      res.writeHead(302, {
        'Location': `/?spotify_token=${access_token}#/spotify-connected`,
      });
      res.end();

    } catch (error) {
        // Hata durumunda kullanıcıyı hata mesajıyla ana sayfaya yönlendir
        res.writeHead(302, {
            'Location': '/?error=spotify_auth_failed',
        });
        res.end();
    }
  } else {
    // Kod gelmezse hata ver
    res.writeHead(302, {
        'Location': '/?error=authorization_code_missing',
    });
    res.end();
  }
};