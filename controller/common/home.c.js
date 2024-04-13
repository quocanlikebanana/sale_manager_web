const { concatObject } = require("../../helper/all");
const { SessionData } = require("../../helper/session.data");
const { Category } = require("../../model/category.m");
const { Product } = require("../../model/product.m");

// Shares between session:
const view = 'common/home';
const renderShare = {
    layout: 'main',
    scripts: ['/setting.client.js', '/page/home.client.js'],
    categories: null,
};


module.exports = {
    async render(req, res, next) {
        const session = new SessionData(req);
        const renderSetting = session.setting.toRenderObj();
        const renderUser = session.user.toRenderObj();

        // Refresh the categories when render to update data
        renderShare.categories = await Category.getAll();

        const home = session.render.home;
        if (home.isInitialized === false) {
            home.initialize(renderShare.categories.map(c => c.CatID));
        }

        const result = await Product.getFull(home.searchText, home.choosenCategory, home.perPage, home.pageNum);
        const renderHome = home.toRenderObj(result);

        const renderObj = concatObject(renderShare, renderSetting, renderHome, renderUser);
        return res.render(view, renderObj, null);
    },

    // >>>> =============================================
    // Will auto call GET (render) because of the refresh !!!
    // <<<< =============================================

    // body: search
    async search(req, res, next) {
        const search = req.body.search;
        const home = new SessionData(req).render.home;
        home.searchText = search;
        home.pageNum = 1;
        return res.status(200).end();
    },

    // body: checkedCategory
    async filter(req, res, next) {
        const checkedCategoryArray = req.body.checkedCategoryArray;
        const home = new SessionData(req).render.home;
        home.choosenCategory = checkedCategoryArray;
        home.pageNum = 1;
        return res.status(200).end();
    },

    // body: page
    async page(req, res, next) {
        const page = req.body.page;
        const home = new SessionData(req).render.home;
        if (page == 'up') {
            home.pageNum = Math.min(home.totalPage, home.pageNum + 1);
        } else if (page == 'down') {
            home.pageNum = Math.max(1, home.pageNum - 1);
        } else {
            // Page is number / string, and shouldn't be out of range
            home.pageNum = Number(page);
        }
        res.status(200).end();
    },
};
