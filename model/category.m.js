const dbService = require("../service/dbService");
const tableName = 'Categories';

class Category {
    constructor(category) {
        this.CatID = category.CatID;
        this.CatName = category.CatName;
    }
    static async getAll() {
        const raws = await dbService.getAll(tableName);
        const categories = [];
        for (const raw of raws) {
            categories.push(new Category(raw));
        }
        return categories;
    }
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

module.exports = { Category };