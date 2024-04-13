module.exports = {
    addProperty(targetObj, sourceObj) {
        for (const key in sourceObj) {
            if (Object.hasOwnProperty.call(sourceObj, key)) {
                const element = sourceObj[key];
                targetObj[key] = element;
            }
        }
    },
    concatObject(...objects) {
        const res = {};
        for (const obj of objects) {
            // Can't use 'this.addProperty', because of scope, must use module.exports
            module.exports.addProperty(res, obj);
        }
        return res;
    },
    arrayToHashMap(array, hashAttribute) {
        const result = {};
        for (const item of array) {
            result[item[hashAttribute]] = item;
        }
        return result;
    },
};