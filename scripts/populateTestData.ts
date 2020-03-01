import User, { UserProps } from '../models/user'
import Bookshelf, { BookshelfProps } from '../models/bookshelf'
import Bookclub, { BookclubProps } from '../models/bookclub';

const TEST_USERS : UserProps[] = [
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
]

const TEST_BOOKSHELVES : BookshelfProps[] = [
    {
        "owner": "",
        "name": "CS50 Extra Reading",
        "description": "Proident ullamco esse ullamco id labore sint incididunt aliquip ut. Ex proident laborum voluptate occaecat eiusmod. Voluptate aliquip labore deserunt ullamco aliquip et qui ex do consectetur id dolor culpa. Labore id officia reprehenderit nulla.",
        "src": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg",
        "books": []
    }
]

const TEST_BOOKCLUBS : BookclubProps[] = [
    {
        "owner": "",
        "name": "Chinese Literature",
        "description": "Proident ullamco esse ullamco id labore sint incididunt aliquip ut. Ex proident laborum voluptate occaecat eiusmod. Voluptate aliquip labore deserunt ullamco aliquip et qui ex do consectetur id dolor culpa. Labore id officia reprehenderit nulla.",
        "bookshelves": [],
        "numMembers": 15
    },
    {
        "owner": "",
        "name": "NYTimes Initiative",
        "description": "Proident ullamco esse ullamco id labore sint incididunt aliquip ut. Ex proident laborum voluptate occaecat eiusmod. Voluptate aliquip labore deserunt ullamco aliquip et qui ex do consectetur id dolor culpa. Labore id officia reprehenderit nulla.",
        "bookshelves": [],
        "numMembers": 190
    }
]

async function populate() {
    // WIPE ALL THE DBS FIRST HAHHA
    await User.deleteMany({});
    await Bookshelf.deleteMany({});
    await Bookclub.deleteMany({});

    let insertedUsers = await User.insertMany(TEST_USERS)
    let firstUser = insertedUsers[0]
    let secondUser = insertedUsers[1]

    // setting the owner of the bookclubs to be the first populated user
    TEST_BOOKCLUBS[0].owner = firstUser.id
    TEST_BOOKCLUBS[1].owner = secondUser.id
    let insertedBookclubs = (await Bookclub.insertMany(TEST_BOOKCLUBS)).map(club => { return club.id})

    // setting the owner of the bookshelves to be the first populated user
    for(let i=0;i<TEST_BOOKSHELVES.length;i++) {
        TEST_BOOKSHELVES[i].owner = firstUser.id
    }
    let insertedBookshelves = (await Bookshelf.insertMany(TEST_BOOKSHELVES)).map(shelf => {
        return shelf.id
    })

    // add all the bookshelves to the first bookclub
    await Bookclub.update(
        { _id: insertedBookclubs[0] },
        { $push: { bookshelves: { $each: insertedBookshelves } }}
    )

    // updating the first user's bookclub list
    await User.update(
        { _id: firstUser.id },
        { $push: { bookclubs: insertedBookclubs[0] } }
    )

    await User.update(
        { $id: secondUser.id },
        { $push: {bookclubs: insertedBookclubs[1]}}
    )

    // updating the first user's bookshelf list
    await User.update(
        { _id: firstUser.id },
        { $push: { bookshelves: { $each: insertedBookshelves } } }
    )

    console.log("successfully populated!")
    process.exit(0)
}

populate()