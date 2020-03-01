"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
async function findTestUser(casedUsername, password) {
    if (!casedUsername)
        throw new Error('Username was never defined');
    if (!password)
        throw new Error('Password was never defined');
    const username = casedUsername.toLowerCase();
    const user = await user_1.default.findOne({ username });
    if (user.password === password)
        return user;
    throw new Error();
}
exports.default = findTestUser;
//# sourceMappingURL=userLookup.js.map