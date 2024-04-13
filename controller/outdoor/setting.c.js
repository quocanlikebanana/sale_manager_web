const { SessionData } = require("../../helper/session.data");

function configSettings(req, res, next) {
    const dark = req.body.dark;
    const setting = new SessionData(req).setting;
    // Add more settings ...
    setting.dark = dark;
    return res.status(200).end();
    // Client will re-request the previous page (refresh) (and render new setting)
}

module.exports = { configSettings }