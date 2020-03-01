import mongoose from '../db';

const BookclubSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    bookshelves: {
        type: [String]
    },
    numMembers: {
        type: Number,
        default: 1
    }
});

export type BookclubProps = {
    fullName: String,
    bookshelves: String[],
    numMembers: Number
};

export type Bookclub = mongoose.Document & BookclubProps;

export default mongoose.model<Bookclub>("Bookclub", BookclubSchema);