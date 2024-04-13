require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PW: process.env.DB_PW,
    DB_DB: process.env.DB_DB,
    // Secret key in shared between server host, so its not in .env
    SECRET_KEY: 'iDh@35@4f',
};