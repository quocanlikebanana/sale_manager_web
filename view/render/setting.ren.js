class SettingState {
    constructor(session) {
        if (session.setting != null) {
            this.dark = session.setting.dark;
        } else {
            this.dark = false;
        }
        session.setting = this;
    }
    toRenderObj() {
        return {
            dark: this.dark,
        };
    }
}

module.exports = { SettingState };