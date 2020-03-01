import mongoose from '../db';


const UserSchema = new mongoose.Schema({
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

export type UserProps = {
    fullName: String,
    email: String,
    pfp: String,
    bookshelves: String[],
    books: [{
        bookshelf: String,
        index: Number,
        status: Number,
        reflection: String
    }]
};

export type User = mongoose.Document & UserProps;

export default mongoose.model<User>("User", UserSchema);