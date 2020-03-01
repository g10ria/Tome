"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const bookshelf_1 = require("../models/bookshelf");
const TEST_USERS = [
    {
        "fullName": "Amelia Smith",
        "username": "ameliam",
        "password": "secret",
        "email": "22gloriaz@students.harker.org",
        "pfp": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg"
    },
    {
        "fullName": "The NY Times",
        "username": "nytimes",
        "password": "secret",
        "email": "22gloriaz@students.harker.org",
        "pfp": "https://upload.wikimedia.org/wikipedia/commons/4/40/New_York_Times_logo_variation.jpg"
    }
];
const TEST_BOOKSHELVES = [
    {
        "owner": "",
        "name": "CS50 Extra Reading",
        "description": "Proident ullamco esse ullamco id labore sint incididunt aliquip ut. Ex proident laborum voluptate occaecat eiusmod. Voluptate aliquip labore deserunt ullamco aliquip et qui ex do consectetur id dolor culpa. Labore id officia reprehenderit nulla.",
        "src": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg",
        "books": []
    }
];
async function populate() {
    // WIPE ALL THE DBS FIRST HAHHA
    await user_1.default.deleteMany({});
    await bookshelf_1.default.deleteMany({});
    // await bookclub.deleteMany({})
    let firstUser = (await user_1.default.insertMany(TEST_USERS))[0];
    // setting the owner of the bookshelves to be the first populated user
    for (let i = 0; i < TEST_BOOKSHELVES.length; i++) {
        TEST_BOOKSHELVES[i].owner = firstUser.id;
    }
    let insertedBookshelves = (await bookshelf_1.default.insertMany(TEST_BOOKSHELVES)).map(shelf => {
        return shelf.id;
    });
    // updating the user's bookshelf list
    await user_1.default.update({ _id: firstUser.id }, { $push: { bookshelves: { $each: insertedBookshelves } } });
    console.log("successfully populated!");
    process.exit(0);
}
populate();
//# sourceMappingURL=populateTestData.js.map