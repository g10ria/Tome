"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const UserSchema = new db_1.default.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pfp: {
        type: String,
        required: true
    },
    bookshelves: [{
            type: String,
            required: false
        }],
    books: [{
            bookshelf: {
                type: String
            },
            index: {
                type: Number
            },
            status: {
                type: Number
            },
            reflection: {
                type: String
            }
        }]
});
exports.default = db_1.default.model("User", UserSchema);
//# sourceMappingURL=user.js.map