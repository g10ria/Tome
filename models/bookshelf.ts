import mongoose from '../db';

const BookshelfSchema = new mongoose.Schema({
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

export type BookshelfProps = {
    owner: string,
    name: string,
    description: string,
    src: string,
    books: string[]
};

export type Bookshelf = mongoose.Document & BookshelfProps;

export default mongoose.model<Bookshelf>("Bookshelf", BookshelfSchema);