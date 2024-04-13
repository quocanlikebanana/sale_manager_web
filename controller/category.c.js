const { SessionData } = require('../helper/session.data');
const { Category } = require('../model/category.m');

const categoryScript = ['/category.js', '/setting.client.js'];

module.exports = {
    async render(req, res, next) {
        const session = new SessionData(req.session);
        const render = session.render;
        res.render('category', {
            layout: 'main',
            scripts: categoryScript,
            categories: await Category.getAll(),
            dark: render.dark,
        }, null);
    },

    async insert(req, res, next) {
        const body = req.body;
        const result = await Category.insert(body);
        res.status(201).end();
    },

    async update(req, res, next) {
        const body = req.body;
        const result = await Category.update(body);
        res.status(201).end();
    },

    async delete(req, res, next) {
        const body = req.body;
        const result = await Category.delete(body);
        res.status(201).end();
    },
}


