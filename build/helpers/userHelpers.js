"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
async function userFromUsername(username) {
    return await user_1.default.findOne({ username });
}
exports.userFromUsername = userFromUsername;
async function userFromID(id) {
    return await user_1.default.findOne({ _id: id });
}
exports.userFromID = userFromID;
//# sourceMappingURL=userHelpers.js.map