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
            type: String
        },
        reflection: {
            type: String
        }
    }],
    bookclubs: [{
        type: String
    }],
    journalentries: [{
        name: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        date: {
            type: String, // ISOstring format
            required: true
        },
        color: {
            type: String,
            required: true
        }
    }]
});

export type UserProps = {
    fullName: String,
    username: String,
    password: String,
    email: String,
    pfp: String,
    bookshelves?: String[],
    books?: {
        bookshelf: String,
        index: Number,
        status: String,
        reflection: String
    }[],
    bookclubs?: String[],
    journalentries?: {
        name: String,
        content: String,
        date: String,
        color: String
    }[]
};

export type User = mongoose.Document & UserProps;

export default mongoose.model<User>("User", UserSchema);