class HomeState {
    constructor(sessionRender) {
        // https://stackoverflow.com/questions/54254837/how-to-set-multiple-class-properties-to-properties-of-one-object
        if (sessionRender.home != null) {
            Object.assign(this, sessionRender.home);
        } else {
            this.searchText = '';
            this.choosenCategory = null;
            this.perPage = 6;
            this.pageNum = 1;
            this.totalPage = 0;
            this.isInitialized = false;
        }
        sessionRender.home = this;
    }

    // When requires resources
    initialize(choosenCategory) {
        this.choosenCategory = choosenCategory;
        this.isInitialized = true;
    }

    toRenderObj(result) {
        const products = result.data;
        this.totalPage = result.totalPage;
        return {
            searchText: this.searchText,
            choosenCategory: this.choosenCategory,
            pageNum: this.pageNum,
            totalPage: this.totalPage,
            products,
        };
    }
}

module.exports = { HomeState };