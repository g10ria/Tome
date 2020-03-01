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

async function populate() {
    // WIPE ALL THE DBS FIRST HAHHA
    await User.deleteMany({})
    await Bookshelf.deleteMany({})
    // await bookclub.deleteMany({})

    let firstUser = (await User.insertMany(TEST_USERS))[0]

    // setting the owner of the bookshelves to be the first populated user
    for(let i=0;i<TEST_BOOKSHELVES.length;i++) {
        TEST_BOOKSHELVES[i].owner = firstUser.id
    }
    let insertedBookshelves = (await Bookshelf.insertMany(TEST_BOOKSHELVES)).map(shelf => {
        return shelf.id
    })

    // updating the user's bookshelf list
    await User.update(
        { _id: firstUser.id },
        { $push: { bookshelves: { $each: insertedBookshelves } } }
    )

    console.log("successfully populated!")
    process.exit(0)
}

populate()