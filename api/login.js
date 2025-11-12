// api/login.js

const querystring = require('querystring');
const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env;

// Kullanıcının kişisel çalma listelerini okuma izni istiyoruz
const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';

module.exports = (req, res) => {
  // Kullanıcıyı Spotify yetkilendirme sayfasına yönlendir
  res.writeHead(302, {
    'Location': 'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        show_dialog: true,
      }),
  });
  res.end();
};
