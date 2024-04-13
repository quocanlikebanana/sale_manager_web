class MessageState {
    constructor(sessionRender) {
        // https://stackoverflow.com/questions/54254837/how-to-set-multiple-class-properties-to-properties-of-one-object
        if (sessionRender.message != null) {
            Object.assign(this, sessionRender.message);
        } else {
            this.readMode = true;
        }
        sessionRender.message = this;
    }

    toRenderObj() {
        return {
            readMode: this.readMode,
        };
    }
}

module.exports = { MessageState };