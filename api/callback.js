// api/callback.js (Emin olmak için bu kodu tekrar kopyalayıp yapıştırabilirsiniz)

const axios = require('axios');
// querystring kütüphanesini doğru şekilde import ettiğimizden emin olalım
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
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token', // Burası doğru olmalı
        data: querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization':
            // Client ID ve Secret Base64 ile şifreleniyor
            'Basic ' +
            Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
        },
      });

      const { access_token } = response.data;
      
      res.writeHead(302, {
        'Location': `/?spotify_token=${access_token}#/spotify-connected`,
      });
      res.end();

    } catch (error) {
        console.error("Spotify Token Hata Detayı:", error.response ? error.response.data : error.message);
        res.writeHead(302, {
            'Location': '/?error=spotify_auth_failed',
        });
        res.end();
    }
  } else {
    res.writeHead(302, {
        'Location': '/?error=authorization_code_missing',
    });
    res.end();
  }
};
