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
        date: {
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
    fullName: string,
    username: string,
    password: string,
    email: string,
    pfp: string,
    bookshelves?: string[],
    books?: {
        bookshelf: string,
        index: number,
        status: string,
        date?: string
    }[],
    bookclubs?: string[],
    journalentries?: {
        name: string,
        content: string,
        date: string,
        color: string
    }[]
};

export type User = mongoose.Document & UserProps;

export default mongoose.model<User>("User", UserSchema);