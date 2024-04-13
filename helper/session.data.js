const { HomeState } = require("../view/render/home.ren");
const { MessageState } = require("../view/render/message.ren");
const { SettingState } = require("../view/render/setting.ren");
const { PERMISSION } = require("./enum");

// 'this' must be at last, or data will lost
// must set value if null first (prevent error)

class Render {
    constructor(session) {
        session.render ??= this;
        this.home = new HomeState(session.render);
        this.message = new MessageState(session.render);
        session.render = this;
    }
}

class UserRender {
    constructor(header) {
        this.header = header;
    }
    toRenderObj() {
        return {
            header: this.header,
        };
    }
}

const UserRenderMap = {
    [PERMISSION.user]: new UserRender('userHeader'),
    [PERMISSION.admin]: new UserRender('adminHeader'),
}

// Its purpose to explicitly cast
class SessionData {
    constructor(req) {
        // session always not null, if we set it will cause error
        this.session = req.session;
        this.render = new Render(req.session);
        this.setting = new SettingState(req.session);
        this._user = req.user; // private
    }
    // Special cases:
    // 1. User can't change their infomation => just map to the instance (no need set req.session extra data (get only))
    get user() {
        return UserRenderMap[this._user.Permission]
    }
    // 2. we don't know exactly what properies it contains
    get flash() {
        // Make sure its not null, cause we reference its properties
        return this.session.flash ?? {};
    }
    set flash(value) {
        this.session.flash = value;
    }
    deleteFlash() {
        this.flash = {};
    }
}


module.exports = { SessionData };

// setProperty(target, source) {
//     this.session[target] = {};
//     for (const key in source) {
//         if (Object.hasOwnProperty.call(source, key)) {
//             const element = source[key];
//             this.session[target][key] = element;
//         }
//     }
// }