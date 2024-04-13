const { concatObject, addProperty, arrayToHashMap } = require("../../helper/all");
const { SessionData } = require("../../helper/session.data");
const { Message } = require("../../model/message.m");

const view = 'common/message';

const renderBase = {
    layout: 'main',
    scripts: ['/setting.client.js', '/page/message.client.js'],
};

module.exports = {
    async render(req, res, next) {
        const session = new SessionData(req);
        const renderSetting = session.setting.toRenderObj();
        const renderUser = session.user.toRenderObj();
        const renderMessage = session.render.message.toRenderObj();

        // The take message part is in the poll()
        // const receiver = req.user.Username;
        // const messages = await Message.getReceivedMail(receiver);
        const renderObj = concatObject(renderSetting, renderMessage, renderUser, renderBase);
        return res.render(view, renderObj, null);
    },

    async new(req, res, next) {
        const message = new SessionData(req).render.message;
        message.readMode = false;
        return res.status(200).end();
    },

    async cancel(req, res, next) {
        const message = new SessionData(req).render.message;
        message.readMode = true;
        return res.status(200).end();
    },

    async send(req, res, next) {
        const message = new SessionData(req).render.message;
        message.readMode = true;
        const sender = req.user.Username;
        const receiver = req.body.receiver;
        const messageData = req.body.message;
        await Message.pushConversation(sender, receiver, messageData);
        return res.status(200).end();
    },


    // HTTP Long Polling

    async poll(req, res, next) {
        setTimeout(async () => {
            const receiver = req.user.Username;
            const data = await Message.getReceivedMail(receiver);
            return res.json(data);
        }, 1000);
    },

    // Socket io

}