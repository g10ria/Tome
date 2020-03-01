"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const BookshelfSchema = new db_1.default.Schema({
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
    src: {
        type: String,
        default: "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg"
    },
    books: {
        type: [String],
        default: []
    }
});
exports.default = db_1.default.model("Bookshelf", BookshelfSchema);
//# sourceMappingURL=bookshelf.js.map