// api/callback.js - GÜNCELLENMİŞ VERSİYON

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
        // HATA YAKALAMA VE LOGLAMA
        console.error("HATA DETAYI: Spotify Token İsteği Başarısız Oldu.");
        if (error.response) {
            // Spotify'dan gelen 400 Bad Request hatası burada yakalanır
            console.error("Hata Kodu:", error.response.status);
            console.error("Hata Verisi:", error.response.data);
        } else {
            console.error("Ağ Hatası:", error.message);
        }
        
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
