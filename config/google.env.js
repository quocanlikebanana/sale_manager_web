require('dotenv').config();

module.exports = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT: process.env.GOOGLE_OAUTH_REDIRECT,
};