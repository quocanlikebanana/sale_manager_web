const fsPromise = require('fs/promises');

const env = require('../config/env');
const path = require('path');
const pgp = require('pg-promise')({
    capSQL: true,
});

const connection = {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_DB,
    user: env.DB_USER,
    password: env.DB_PW,
    max: 50,
};

const baseDb = pgp(connection);

// dbAction: (string) one, none, any
// query: (string) query string
// valueArr: (string[]) value to replace in query string
async function dbAccess(db, dbAction, queryString, valueArr) {
    let dbcn = null;
    try {
        dbcn = await db.connect();
        const res = await dbcn[dbAction](queryString, valueArr);
        return res;
    } catch (err) {
        throw (err);
    } finally {
        if (dbcn) {
            dbcn.done();
        }
    }
}

module.exports = {
    baseDb, pgp, dbAccess
}

// >>>> =============================================
// Dev Functions
// <<<< =============================================

// The database is postgres, which always exists
const dev = false;
if (dev) {
    async function initDbFromScript(relpath = '../resource/dbscript.txt') {
        try {
            const query = await fsPromise.readFile(path.join(__dirname, relpath), { encoding: 'utf-8' });
            const res = await dbAccess(baseDb, 'none', query);
            return res;
        }
        // Database exists
        catch (err) {
            // console.log(err);
        }
    }

    (async () => {
        await initDbFromScript();
        // await resetSeqAll();
    })();
}

// Old Database check
// // Return a connection (lazy) to database
// const newConnection = connection;
// newConnection.database = dbName;
// const db = pgp(connection);
// // Check database exists
// const check = await DbAccess(baseDb, 'one', `SELECT COUNT(*) FROM pg_catalog.pg_database WHERE datname = $1`, [dbName]);
// if (check && check.count === '0') {
//     // Create database
//     await DbAccess(baseDb, 'none', 'CREATE DATABASE $1:name ', [dbName]);
//     // Add tables
//     const { schema } = require('./table.schema');
//     await DbAccess(db, 'none', schema);
//     // Add data
//     await ReadDataTo(db);
//     console.log('created new database');
// } else {
//     console.log('database already existed');
// }



//     async  GetCurrentDatabase(db) {
//     // const query = 'SELECT current_catalog';
//     const query = 'SELECT current_database()';
//     return await DbAccess(db, 'one', query);
// },