"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const TEST_USERS = [
    {
        "fullName": "Amelia Smith",
        "username": "ameliam",
        "password": "secret",
        "email": "22gloriaz@students.harker.org",
        "pfp": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg"
    }
];
async function populate() {
    await user_1.default.insertMany(TEST_USERS, (err, docs) => {
        if (err) {
            console.log(err);
            process.exit(-1);
        }
        else {
            console.log("done populating");
            process.exit(0);
        }
    });
}
populate();
//# sourceMappingURL=populateTestUsers.js.map