const jwt = require('jsonwebtoken');
const google_env = require('../config/google.env');

module.exports = {
    getGoogleOAuthURL() {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const options = {
            redirect_uri: google_env.GOOGLE_OAUTH_REDIRECT,
            client_id: google_env.GOOGLE_CLIENT_ID,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ].join(' '),
        };
        const queryString = new URLSearchParams(options);
        return `${rootUrl}?${queryString.toString()}`;
    },

    async getGoogleOAuthTokens(code) {
        const options = {
            code: code,
            grant_type: 'authorization_code',
            client_id: google_env.GOOGLE_CLIENT_ID,
            client_secret: google_env.GOOGLE_CLIENT_SECRET,
            redirect_uri: google_env.GOOGLE_OAUTH_REDIRECT,
        };
        const result = await fetch('https://accounts.google.com/o/oauth2/token', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(options),
        });
        const data = await result.json();
        return {
            id_token: data.id_token,
            access_token: data.access_token,
        };
    },

    async getGoogleUser(idToken, accessToken) {
        const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
        const result = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${idToken}`
            },
            method: 'GET',
        });
        const data = await result.json();
        return data;
    },
};