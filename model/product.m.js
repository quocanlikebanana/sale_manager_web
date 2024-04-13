const dbService = require("../service/dbService");
const tableName = 'Products';
const pkColumn = 'ProID';

function toProductArray(raws) {
    const products = [];
    for (const raw of raws) {
        products.push(new Product(raw));
    }
    return products;
}


class Product {
    constructor(product) {
        this.ProID = product.ProID;
        this.ProName = product.ProName;
        this.TinyDes = product.TinyDes;
        this.FullDes = product.FullDes;
        this.Price = product.Price;
        this.CatID = product.CatID;
        this.Quantity = product.Quantity;
    }

    static async getAll() {
        const raws = await dbService.getAll(tableName);
        return toProductArray(raws);
    }

    static async getFull(search, filterInArray, perPage, pageNum) {
        const searchQuery = dbService.querySearch('ProName', search);
        const filterInQuery = dbService.queryFilterIn('CatID', filterInArray);
        const pageQuery = dbService.queryPage(perPage, pageNum);
        const raws = await dbService.getFull(tableName, pkColumn, [searchQuery, filterInQuery], '', pageQuery);
        return {
            data: toProductArray(raws.records),
            totalPage: Math.ceil(raws.count / perPage),
        };
    }


    // >>>> =============================================
    // Product editing
    // <<<< =============================================

    static async insert(objectMap) {
        // Make sure its mapped correctly
        return await dbService.insertDefault(tableName, objectMap, 'CatID');
    }

    static async update(objectMap) {
        return await dbService.updateDefault(tableName, objectMap, 'CatID');
    }

    static async delete(objectIDMap) {
        return await dbService.deleteDefault(tableName, objectIDMap, 'CatID');
    }
}

module.exports = { Product };

