// api/callback.js - GÜNCEL VE HATA YAKALAYICILI VERSİYON

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
        // Spotify'ın token isteme adresi
        url: 'https://accounts.spotify.com/api/token', 
        data: querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization':
            // Client ID ve Secret Base64 ile şifrelenip gönderiliyor
            'Basic ' +
            Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
        },
      });

      const { access_token } = response.data;
      
      // Başarılı olursa kullanıcıyı ana sayfaya yönlendir ve token'ı URL'e ekle
      res.writeHead(302, {
        'Location': `/?spotify_token=${access_token}#/spotify-connected`,
      });
      res.end();

    } catch (error) {
        // HATA YAKALAMA VE DETAYLI LOGLAMA KISMI
        console.error("🔥🔥🔥 HATA DETAYI: Spotify Token İsteği Başarısız Oldu.");
        if (error.response) {
            // Spotify'dan gelen 400 Bad Request hatasının detayını logla
            console.error("🔥 Hata Kodu:", error.response.status);
            console.error("🔥 Hata Verisi (Spotify Mesajı):", error.response.data);
            console.error("🔥 API URI Kontrolü:", SPOTIFY_REDIRECT_URI);
        } else {
            console.error("Ağ Hatası:", error.message);
        }
        
        // Hata durumunda kullanıcıyı ana sayfaya yönlendir
        res.writeHead(302, {
            'Location': '/?error=spotify_auth_failed',
        });
        res.end();
    }
  } else {
    // Code parametresi eksik gelirse
    res.writeHead(302, {
        'Location': '/?error=authorization_code_missing',
    });
    res.end();
  }
};
