const dbService = require('../service/dbService');

const tableName = 'Users';

class User {
    constructor(user) {
        this.ID = user.ID;
        this.Username = user.Username;
        this.Password = user.Password;
        this.Name = user.Name;
        this.Email = user.Email;
        this.DOB = user.DOB;
        this.Permission = user.Permission;
    }
    static async getUser(username) {
        const data = await dbService.getSingleByCol(tableName, 'Username', username);
        return data ? new User(data) : null;
    }
    static async checkUsernameExists(username) {
        const search = await dbService.getSingleByCol(tableName, 'Username', username);
        if (search != null) {
            return true;
        }
        return false;
    }
    // Exactly from HTML form field
    static async insertUser(normData) {
        const objMap = {
            // ID: normData.id,     // Do not insert ID, let database do it
            Username: normData.username,
            Password: normData.password,
            Name: normData.name,
            Email: normData.email,
            DOB: normData.dob,
            Permission: normData.permission,
        }
        // Returning all, instead of only ID
        const data = await dbService.insertDefault(tableName, objMap, '*');
        return data ? new User(data) : null;
    }
}

module.exports = User;