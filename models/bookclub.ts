import mongoose from '../db';

const BookclubSchema = new mongoose.Schema({
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

export type BookclubProps = {
    owner: string,
    name: string,
    description: string,
    bookshelves: string[],
    numMembers: number
};

export type Bookclub = mongoose.Document & BookclubProps;

export default mongoose.model<Bookclub>("Bookclub", BookclubSchema);