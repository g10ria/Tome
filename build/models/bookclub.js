"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const BookclubSchema = new db_1.default.Schema({
    owner: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bookshelves: [{
            type: String
        }],
    numMembers: {
        type: Number,
        default: 1
    }
});
exports.default = db_1.default.model("Bookclub", BookclubSchema);
//# sourceMappingURL=bookclub.js.map