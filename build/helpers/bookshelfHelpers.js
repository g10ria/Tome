"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bookshelf_1 = require("../models/bookshelf");
async function bookshelfFromID(id) {
    return await bookshelf_1.default.findOne({ id });
}
exports.bookshelfFromID = bookshelfFromID;
//# sourceMappingURL=bookshelfHelpers.js.map