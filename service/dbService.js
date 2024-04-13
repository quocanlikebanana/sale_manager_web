const db = require('./dbCreate');

// class DataQuery {
//     constructor(tableName, pkColumn, searchQuery, sortQuery, filterCateQuery, filterRangeQuery, pagingQuery) {
//         this.tableName = tableName;
//         this.pkColumn = pkColumn;
//         this.searchQuery = searchQuery;
//         this.sortQuery = sortQuery;
//         this.filterInQuery = filterCateQuery;
//         this.filterBetweenQuery = filterRangeQuery;
//         this.pagingQuery = pagingQuery;
//     }
//     async getTotalPage() {
//         const query = `
//         SELECT COUNT(*) FROM ${db.pgp.as.name(this.tableName)} WHERE True
//         ${this.searchQuery}
//         ${this.filterInQuery}
//         ${this.filterBetweenQuery}`;
//         const count = await db.dbAccess(db.baseDb, 'one', query);
//         return count;
//     }
//     async getData() {
//         const query = `
//         SELECT * FROM ${db.pgp.as.name(this.tableName)} WHERE True
//         ${this.searchQuery}
//         ${this.filterInQuery}
//         ${this.filterBetweenQuery}
//         ORDER BY ${db.pgp.as.name(this.tableName)} ASC ${this.sortQuery}
//         ${this.pagingQuery}`;
//         const record = await db.dbAccess(db.baseDb, 'any', query);
//         return record;
//     }
// }

// FOR MODEL TO RE-IMPLEMENT
module.exports = {

    // >>>> =============================================
    // Query support
    // <<<< =============================================

    // start

    queryTable(tableName) {
        const query = `SELECT * FROM ${db.pgp.as.name(tableName)} `
        return db.pgp.as.format(query);
    },

    queryCount(tableName) {
        const query = `SELECT COUNT(*) FROM ${db.pgp.as.name(tableName)} `
        return db.pgp.as.format(query);
    },

    // middle

    querySearch(column, search) {
        const query = ` AND $1:name ILIKE \'%$2:value%\'`
        return db.pgp.as.format(query, [column, search]);
    },

    queryFilterIn(column, filterArray) {
        //Filter: https://stackoverflow.com/questions/36839753/pass-an-array-of-integers-in-array-of-parameters
        if (filterArray.length === 0) {
            return ' ';
        }
        const query = ` AND $1:name IN($2:csv)`;
        return db.pgp.as.format(query, [column, filterArray]);
    },

    queryFilterBetween(column, lower, upper) {
        const query = ` AND $1:name BETWEEN $2:value AND $3:value`;
        return db.pgp.as.format(query, [column, lower, upper]);
    },

    // end

    querySort(column, isAsc) {
        const queryAsc = isAsc ? 'ASC' : 'DESC';
        const query = ` , $1:name ${queryAsc}`;
        return db.pgp.as.format(query, [column]);
    },

    queryPage(perPage, pageNum) {
        const offset = perPage * (pageNum - 1);
        const query = ` LIMIT $1:value OFFSET $2:value`;
        return db.pgp.as.format(query, [perPage, offset]);
    },

    // >>>> =============================================
    // Get Data
    // <<<< =============================================

    async getSingleByCol(tableName, column, value) {
        const query = `SELECT * FROM $1:name WHERE $2:name = \'$3:value\'`;
        const res = await db.dbAccess(db.baseDb, 'oneOrNone', query, [tableName, column, value]);
        return res;
    },

    async getAll(tableName) {
        const query = `SELECT * FROM $1:name`;
        const res = await db.dbAccess(db.baseDb, 'any', query, [tableName]);
        return res;
    },

    async getTotalPage(tableName, middleSubQueries) {
        const middleQuery = middleSubQueries.join('\n');
        const countQuery = module.exports.queryCount(tableName);
        const query = `
        ${countQuery}
        WHERE True
        ${middleQuery}`;
        const count = await db.dbAccess(db.baseDb, 'one', query);
        return count;
    },

    // startQuery: for table, table join (not include 'where')
    // middleQueries: search, filterIn, filterBetween, ...
    async getFull(tableName, pkColumn, middleSubQueries, sortQuery, pagingQuery) {
        const startQuery = module.exports.queryTable(tableName);
        const countQuery = module.exports.queryCount(tableName);
        const middleQuery = middleSubQueries?.join('\n') ?? '';

        const query = `
        ${startQuery} 
        WHERE True
        ${middleQuery}
        ORDER BY ${db.pgp.as.name(pkColumn)} ASC ${sortQuery ?? ''}
        ${pagingQuery ?? ''}`;
        const records = await db.dbAccess(db.baseDb, 'any', query);

        // CountRecord
        const queryCount = `
        ${countQuery}
        WHERE True
        ${middleQuery}`;
        const countStr = await db.dbAccess(db.baseDb, 'one', queryCount);
        const count = parseInt(countStr.count); // NOTICE: the return of COUNT(*) is a table with 1 column count !!! (need to access count property)
        return { records, count };
    },

    // >>>> =============================================
    // Modify
    // <<<< =============================================

    async insertDefault(tableName, objectMap, returnColumn) {
        let returnColumnQuery = '';
        if (returnColumn) {
            if (returnColumn === '*') {
                returnColumnQuery = ` RETURNING *`;
            } else {
                returnColumnQuery = ` RETURNING "${returnColumn}"`;
            }
        }
        const onConflictQuery = ` ON CONFLICT DO NOTHING`;
        // Keep insert till there's ID
        let res = null;
        while (!res) {
            const query = db.pgp.helpers.insert(objectMap, null, tableName) + onConflictQuery + returnColumnQuery;
            res = await db.dbAccess(db.baseDb, 'oneOrNone', query);
        }
        return res;
    },

    // ==============================
    // Fix the below - Fixed

    // Uses updated object ID
    async updateDefault(tableName, pkColumn, objectMap, returnColumn) {
        const returnColumnQuery = returnColumn ? ` RETURNING "${returnColumn}"` : '';
        const condition = db.pgp.as.format(` WHERE $1:name = $2:value `, [pkColumn, objectMap[pkColumn]]);
        const query = db.pgp.helpers.update(objectMap, null, tableName) + condition + returnColumnQuery;
        const res = await db.dbAccess(db.baseDb, 'oneOrNone', query);
        return res;
    },

    async deleteDefault(tableName, objectIDMap, returnColumn) {
        const returnColumnQuery = returnColumn ? ` RETURNING "${returnColumn}"` : '';
        const keys = Object.keys(objectIDMap);
        const s = keys.map(k => db.pgp.as.name(k) + ' = ${' + k + '}').join(' AND ');
        const conditions = pgp.as.format(s, objectIDMap);
        const query = `DELETE FROM $1:name WHERE ` + conditions + returnColumnQuery;
        const res = await db.dbAccess(db.baseDb, 'oneOrNone', query, [tableName]);
        return res;
    },
}
