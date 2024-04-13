const PERMISSION = {
    user: 1,
    admin: 2,
}

const AUTH_ERROR = {
    authFailed: 0,
    noUser: 1,
    wrongPassword: 2,
    wrongToken: 3,
}

module.exports = { PERMISSION, AUTH_ERROR };